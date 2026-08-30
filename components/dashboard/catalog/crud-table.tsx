"use client";

import { useActionState, useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { FormState } from "@/app/dashboard/(admin)/taxonomy/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function CrudTable<T>({
  title,
  description,
  rows,
  columns,
  getId,
  getName,
  renderFields,
  saveAction,
  deleteAction,
  newLabel = "New",
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  getId: (row: T) => string;
  getName: (row: T) => string;
  renderFields: (row: T | null) => ReactNode;
  saveAction: (prev: FormState, fd: FormData) => Promise<FormState>;
  deleteAction: (id: string) => Promise<FormState>;
  newLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [state, formAction, pending] = useActionState(saveAction, { ok: false });
  const [deletingId, startDelete] = useTransition();

  useEffect(() => {
    if (state.ok) {
      toast.success(editing ? `${title} updated` : `${title} created`);
      setOpen(false);
      router.refresh();
    }
  }, [state, editing, title, router]);

  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(row: T) {
    setEditing(row);
    setOpen(true);
  }
  function remove(row: T) {
    startDelete(async () => {
      const res = await deleteAction(getId(row));
      if (res.ok) {
        toast.success(`${title} deleted`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not delete");
      }
    });
  }

  return (
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="size-4" />
          {newLabel}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Nothing here yet.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={getId(row)}>
                {columns.map((c) => (
                  <TableCell key={c.header} className={c.className}>
                    {c.cell(row)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(row)}
                      aria-label="Edit"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete"
                          disabled={deletingId}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete “{getName(row)}”?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This cannot be undone. Records still in use cannot be
                            deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(row)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${title.toLowerCase()}` : `New ${title.toLowerCase()}`}
            </DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            {editing && <input type="hidden" name="id" value={getId(editing)} />}
            {renderFields(editing)}
            {state.error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
