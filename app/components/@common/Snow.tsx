import Snowfall from "react-snowfall";
import styles from "./Snow.module.css";

export const Snow = () => {
  return (
    <div className={styles["snowfall-container"]}>
      <Snowfall snowflakeCount={50} speed={[0, 2.5]} />
    </div>
  );
};
