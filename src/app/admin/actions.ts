"use server";

/**
 * Server actions for the admin dashboard and role forms.
 *
 * createRoleAction / updateRoleAction run under useActionState in the client
 * form and return an error string instead of throwing, so failures (including
 * an unreachable D1 binding under plain `next dev`) surface in the UI without
 * crashing. setRoleStatusAction is posted from plain dashboard forms and
 * redirects back to /admin, carrying an ?error= code when nothing changed.
 *
 * Every action starts with await requireAdminSession(): server actions run
 * without rendering the layout, so the layout guard alone would let
 * unauthenticated POSTs mutate D1.
 */

import { redirect } from "next/navigation";
import { createRole, setRoleStatus, updateRole } from "@/lib/portal/db";
import type { ParsedRole } from "@/lib/portal/types";
import { DB_UNAVAILABLE_MESSAGE, tryGetPortalDb } from "./admin-db";
import {
  validateRoleForm,
  validateStatusActionForm,
  type ActionState,
} from "./form-logic";
import { requireAdminSession } from "./session-guard";

const CREATE_FAILED_MESSAGE = "The role could not be created. Nothing was saved.";
const UPDATE_FAILED_MESSAGE = "That change could not be saved, so nothing changed.";

export async function createRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();
  const parsed = validateRoleForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let created: ParsedRole | null = null;
  try {
    created = await createRole(db, {
      title: parsed.value.title,
      openings: parsed.value.openings,
      icon: parsed.value.icon,
      location: parsed.value.location,
      description: parsed.value.description,
      responsibilities: parsed.value.responsibilities,
      requiredSkills: parsed.value.requiredSkills,
      niceToHave: parsed.value.niceToHave,
      status: parsed.value.status,
    });
  } catch {
    return { error: CREATE_FAILED_MESSAGE };
  }
  if (!created) {
    return { error: CREATE_FAILED_MESSAGE };
  }
  redirect("/admin");
}

export async function updateRoleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();
  const roleId = String(formData.get("roleId") ?? "").trim();
  if (!roleId) {
    return { error: "That role could not be found." };
  }
  const parsed = validateRoleForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }
  const db = tryGetPortalDb();
  if (!db) {
    return { error: DB_UNAVAILABLE_MESSAGE };
  }
  let updated: ParsedRole | null = null;
  try {
    updated = await updateRole(db, roleId, {
      title: parsed.value.title,
      openings: parsed.value.openings,
      icon: parsed.value.icon,
      location: parsed.value.location,
      description: parsed.value.description,
      responsibilities: parsed.value.responsibilities,
      requiredSkills: parsed.value.requiredSkills,
      niceToHave: parsed.value.niceToHave,
    });
    if (updated) {
      await setRoleStatus(db, roleId, parsed.value.status);
    }
  } catch {
    return { error: UPDATE_FAILED_MESSAGE };
  }
  if (!updated) {
    return { error: "That role could not be found." };
  }
  redirect("/admin");
}

export async function setRoleStatusAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const parsed = validateStatusActionForm(formData);
  if (!parsed) {
    redirect("/admin?error=invalid");
  }
  const db = tryGetPortalDb();
  if (!db) {
    redirect("/admin?error=unavailable");
  }
  let saved = false;
  try {
    const updated = await setRoleStatus(db, parsed.id, parsed.status);
    saved = updated !== null;
  } catch {
    saved = false;
  }
  if (!saved) {
    redirect("/admin?error=save");
  }
  redirect("/admin");
}
