"use client"
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

const Header = () => {
  const { locale } = useGlobal();
  return (
    <header className="w-full bg-blue-950 text-white p-2 md:p-8 text-center rounded-t-xl">
      <h1 className="m-0 text-4xl font-bold">
        {t(locale, "body.header.title")}
      </h1>
    </header>
  )
}

export default Header