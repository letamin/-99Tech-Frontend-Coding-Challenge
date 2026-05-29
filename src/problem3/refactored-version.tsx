interface WalletBalance {
  blockchain: string; 
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .slice() // to prevent bugs if we remove filter in the future
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(2)
        };
      });
  }, [balances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    
    return (
      <WalletRow 
        style={{ padding: '8px' }} // Missing 'classes.row' reference so style to replace it
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div { ...rest }>
      {rows}
    </div>
  );
};
