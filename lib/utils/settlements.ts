import type { GroupBalance, Settlement } from "@/types";

export function calculateSettlements(balances: GroupBalance[]): Settlement[] {
  const creditors: { id: string; name: string; amount: number }[] = [];
  const debtors: { id: string; name: string; amount: number }[] = [];

  for (const b of balances) {
    if (b.balance > 0.01) {
      creditors.push({ id: b.user_id, name: b.nickname, amount: b.balance });
    } else if (b.balance < -0.01) {
      debtors.push({ id: b.user_id, name: b.nickname, amount: Math.abs(b.balance) });
    }
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i];
    const debt = debtors[j];
    const amount = Math.min(credit.amount, debt.amount);

    if (amount > 0.01) {
      settlements.push({
        from: debt.name,
        fromId: debt.id,
        to: credit.name,
        toId: credit.id,
        amount: Math.round(amount * 100) / 100,
      });
    }

    credit.amount -= amount;
    debt.amount -= amount;

    if (credit.amount < 0.01) i++;
    if (debt.amount < 0.01) j++;
  }

  return settlements;
}

export function calculateEqualShares(
  totalAmount: number,
  memberCount: number
): number {
  return Math.round((totalAmount / memberCount) * 100) / 100;
}