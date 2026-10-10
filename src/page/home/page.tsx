import { Home } from "./index";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const toPage = (value: unknown) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export default async function HomePage({ searchParams }: Props) {
  const { page, q } = await searchParams;
  return <Home page={toPage(page)} query={typeof q === "string" ? q.trim() : ""} />;
}
