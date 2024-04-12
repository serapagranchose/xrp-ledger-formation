import { useBalance } from '@nice-xrpl/react-xrpl';

export default function ShowBalance() {
  const balance = useBalance();

  return (
    <h1 className="text-4xl font-bold">{ balance } XRP</h1>
  );
} 