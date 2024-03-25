import Snowfall from "react-snowfall";
import styles from "./Snow.module.css";
import NoSSR from "@/app/divdivdiv/modules/NoSSR";

export const Snow = () => {
  return (
    <NoSSR>
      <div className={styles["snowfall-container"]}>
        <Snowfall snowflakeCount={50} speed={[0, 2.5]} />
      </div>
    </NoSSR>
  );
};
