import { Composition } from "remotion";
import { HelloFormula } from "./HelloFormula";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloFormula"
        component={HelloFormula}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
