import _calculateAge from "../../helper/age-calucator";
import { LanguageStrings } from "../../types/countries";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import injectVariables from "../../utils/dictionaries/injectVariables";
import SeeProjectsButton from "./_components/SeeProjectButton";

export default async function Home({ params }: { params: { lang: LanguageStrings } }) {
  const strings = await getDictionary("home", params.lang);
  return (
    <div className="w-full flex flex-col items-center h-full">
      <div className="max-w-[800px] px-3">
        <p className="text-3xl font-bold">Maxime Godin</p>
        <p className="text-md font-light">{injectVariables(strings.age, { age: _calculateAge(new Date("1989/01/07")) })} • Tokyo, JP</p>
        <p className="max-w-[800px] py-3 text-xl">{strings.me_descritpion}</p>
        <div className="py-3">
          <SeeProjectsButton />
        </div>
      </div>
    </div>
  );
}
