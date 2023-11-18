import { useData } from "@/context/DataContext";

export default function FormAndButton() {
  const { isAdmin } = useData();

  if (isAdmin) {
    return null;
  }

  return <>Form and button</>;
}
