import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { getAllUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await getAllUsers(q);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      <p className="mt-1 text-muted-foreground">
        {users.length} user{users.length === 1 ? "" : "s"}
        {q ? ` matching "${q}"` : ""}
      </p>

      <form className="mt-6 flex max-w-sm gap-2">
        <Input
          name="q"
          placeholder="Search by email or user id"
          defaultValue={q}
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tickets</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.country ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                    {user.status === "ACTIVE" ? "Active" : "Banned"}
                  </Badge>
                </TableCell>
                <TableCell>{user._count.tickets}</TableCell>
                <TableCell>{user._count.winners}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <UserRowActions userId={user.id} status={user.status} />
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
