import dynamic from "next/dynamic";

const PlayerCharacterSheet = dynamic(
  () => import("./component/playerCharacterSheet/PlayerCharacterSheet"),
  { ssr: false }
);

export default function Home() {
  // const searchParams = useSearchParams();
  // const params = searchParams.get("test");
  // console.log(params, searchParams);

  return (
    <main>
      <PlayerCharacterSheet />
    </main>
  );
}
