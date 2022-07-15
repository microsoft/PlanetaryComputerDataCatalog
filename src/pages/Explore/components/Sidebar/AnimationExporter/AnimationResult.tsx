import {
  getTheme,
  IImageStyles,
  Image,
  ImageFit,
  IStackItemStyles,
  StackItem,
} from "@fluentui/react";

export interface AnimationResponse {
  url: string;
}

interface Props {
  animationResponse: AnimationResponse;
}
export const AnimationResult: React.FC<Props> = ({ animationResponse }) => {
  return (
    <StackItem styles={rowStyles}>
      <Image
        styles={imageStyles}
        alt="layer animation"
        src={animationResponse.url}
        imageFit={ImageFit.contain}
      />
    </StackItem>
  );
};

const theme = getTheme();
const rowStyles: IStackItemStyles = {
  root: {
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: "4px",
  },
};

const imageStyles: Partial<IImageStyles> = {
  root: {
    backgroundColor: "black",
    width: 180,
    borderRadius: "4px",
  },
  image: {
    maxWidth: 180,
    maxHeight: 180,
  },
};
