import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { Calendar } from "lucide-react";
import NavbarDialogMenu from "./NavbarDialogMenu";
import { Button } from "./ui/button";

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function authenticate() {
      setAuthenticated(await isAuthenticated());
    }

    authenticate();
  }, []);

  return (
    <div className="navbar px-10 bg-base-200 drop-shadow-sm min-h-[90px]">
      <div className="navbar-start">
        <Link to="/" className="flex gap-2">
          <Calendar size={35} className="text-primary" strokeWidth={2} />
          <h2 className="text-2xl font-mono text-base-content tracking-wide font-semibold">
            bookeo
          </h2>
        </Link>
      </div>

      <div className="navbar-end">
        {authenticated ? <NavbarDialogMenu /> : <AuthPart />}
      </div>
    </div>
  );
}

function AuthPart() {
  const navigate = useNavigate();

  return (
    <Button
      className="text-primary cursor-pointer"
      onClick={() => {
        navigate("/login");
      }}
      variant={"link"}
    >
      Login
    </Button>
  );
}
