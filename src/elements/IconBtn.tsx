import { FunctionComponent } from "preact";
import { OnClickProp } from "./OnClickProp";

export const IconBtn: FunctionComponent<OnClickProp> = ({children, onClick}) => (<button onClick={onClick}>{children}</button>);