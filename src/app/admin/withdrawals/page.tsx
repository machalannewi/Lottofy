import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WithdrawalStatusAction } from "@/components/admin/withdrawal-status-action";
import { getWithdrawalRequests } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function AdminWithdrawalsPage() {
  const requests = await getWithdrawalRequests();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
      <p className="mt-1 text-muted-foreground">
        Bank details submitted by users requesting a payout.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank name</TableHead>
              <TableHead>Account number</TableHead>
              <TableHead>Routing number</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.user.email}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(request.amount)}
                </TableCell>
                <TableCell>{request.bankName}</TableCell>
                <TableCell className="font-mono">{request.accountNumber}</TableCell>
                <TableCell className="font-mono">
                  {request.routingNumber ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={request.status === "PROCESSED" ? "default" : "secondary"}>
                    {request.status === "PROCESSED" ? "Processed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <WithdrawalStatusAction
                    requestId={request.id}
                    status={request.status}
                  />
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No withdrawal requests yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
