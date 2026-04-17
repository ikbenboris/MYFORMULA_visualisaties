import { Composition } from "remotion";
import { HelloFormula } from "./HelloFormula";
import { PreWorkoutFill, TOTAL_FRAMES } from "./PreWorkoutFill";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PreWorkoutFill"
        component={PreWorkoutFill}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
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
