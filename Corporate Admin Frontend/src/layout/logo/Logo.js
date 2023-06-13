import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoDark2x from "../../images/logo-dark2x.png";
import LogoSmall from "../../images/logo-small.png";
import { Link } from "react-router-dom";

const Logo = () => {
  let companyName = localStorage.getItem("CompanyName")
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link" style={{ display: "flex", gap: "10px" }}>
      <img style={{ width: "40px", height: "40px" }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAvCAYAAACc5fiSAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARTSURBVHgB3ZrNbhtVFMf/5zpRE4TUeQHUyY6PjcOmaYWU6a4Eidh5Adw1EnGeIAksWNapYJ3kCWyQorKiUwEpsKCTRVF3GcQDMBVITf1xD+eO0w+ntuO5x1LV/qTIGfve3P+9c849f98JYYocf1WODJtVS1yRy/D07YSYEu7Z7YXtJMWUIEyB481yQDO0y0BlXDuZwJ5MYEMmkEGJWvjx1+UQXbqD5ys8HkaKHi9qxRsooS7tYlLReQdpO0NNKFEJP/6yXJPwiFCcyOUDFKiEE9Fn8IY2ocA7xl1Cyi3/B/5k6PKCb6z7r/gMytARXJili/BEnZyvCn/hXdnWlDzp8CN44i38tApq9uJEs5erQsUwN+CJAe9BgUq47WEHPqsu1dN28R0UqIT3bzVXUZQSV7WGa+Q+HgVRALRDmZu82izODpNRbaUKirmimzi/9GczFpV3Nu/fHdWg+W4llL02zC/mukk1aWUTCY+CqzVwXhGjwU84lVscw9jtOPs1Pduvb7Yg1ZCcQwzOCobLBwmtYQnZLFdC6ph1IsjYg30JFDN6e6sPWvuD7z8THIXgzi7O9R4yASptxNlPrVEt/t5eXLaGQ/e7xPKRvKSjdpDvP1irM8mE+aXJYlAox71ZviF3IO1fPxc9uTXNFaEW//vLPhTkooGbk/fg1M7yoguffnLajjM8IYpg0IiCpRCeuPAoJtpBYaltdvPho+CjCC62ihOAS7vwpNQxXu5QwqoiCRwZWFZYU0T93acYp6tdgydUMqtGVlvn8nrtZRSlV1KNSYyKi3GlPaXCK24Yl6CBELzWtjaFAmKboiCW8BcUMHMqJg0t+JPd+e/e3cK9Sr0YGktMFBsY8ndpzF6TdgWEFAsmh0o7Js5+jmXVPXy1lH7xLfCkZ/O+HpbYblUfttJ+cppZ90eSAt0zyezqMLM1KW5wS7aYJWZOVv9s5Yv1oskK8tJPqJ/TO+2LHm5z6/duh+JjImv6W558SzqSmEwaVz5Oh7Vvvl8pS7w28xOucaPCNioPWhtPr1+ytdfevrLMxtTkk7P2VELKtmAu7MfizocIjqQaujIeDR8asQx2Y/QE1mpEvC429sW6krHkgrG89+nD5sAmMPZAyN0Fc9K++OPJ4djtq374g1hTnsgwEfNG4+rK2Jw6eG/tUvuxfVRNWyNzQH1aW0T0U9hw7dblFZUlVgl38Sy38r4rwYU6Mmc0/2ShsVh9NccTeUwXFe0gCuzJ3DoUaL1KBE8k1utQ4C28/vuBy/4Qvsiqf/7HgbdL9F/xnikeIlPEX3jJqh9AafAXPvtWCg2ys3z74Sfe9tZbeGPxmlvxGL4Qaey08hkQ4O8ODXmf9DpUwsV3xOKri1dA4sY3l68fQYH+O+f8XN25vwI99naWVjagZCqPxB1f/HZ7kyy2RjZgcXqGtm4tXd/BFJiacIfzLpZpldw/IUiBkZ1DfigRaxCb+cf7Gm/yxvA/74+yE5XjA8IAAAAASUVORK5CYII=" alt="logo" />
      <h3 style={{ fontSize: "19px" }}>{companyName}</h3>
    </Link>
  );
};

export default Logo;
