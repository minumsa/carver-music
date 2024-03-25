import Snowfall from "react-snowfall";
import styles from "./Snow.module.css";

// 정상 커밋 테스트

export const Snow = () => {
  return (
    <div className={styles["snowfall-container"]}>
      <Snowfall snowflakeCount={50} speed={[0, 2.5]} />
    </div>
  );
};
