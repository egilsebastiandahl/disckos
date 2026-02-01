"use client";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"

const ThemeSwitch = () => {

    const { setTheme } = useTheme()
    return (
        <Switch onCheckedChange={e => setTheme(e.valueOf() ? "light" : "dark")} />
    );
}
export default ThemeSwitch;