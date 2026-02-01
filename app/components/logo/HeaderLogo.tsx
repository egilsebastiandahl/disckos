import Link from "next/link";
import CozyLogo from "./CozyLogo";

export default function HeaderLogo(){

    return (
        <Link href="/">
            <CozyLogo></CozyLogo>
        </Link>
    )
}