"use client"
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

const Header = () => {
  const { locale } = useGlobal();
  return (
    <header className="w-full bg-blue-950 text-white p-2 md:p-8">
      <h1 className="m-auto text-4xl text-center align-middle font-bold">
        {t(locale, "body.header.title")}
      </h1>
    </header>
  )
}

export default Header