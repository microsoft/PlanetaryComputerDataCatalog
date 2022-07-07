import { ContextualMenu, Dialog, DialogType } from "@fluentui/react";
import { useState } from "react";

import { useExploreSelector } from "pages/Explore/state/hooks";

const modalProps = {
  containerClassName: "animation-exporter-bounds-dialog",
  isModeless: true,
  dragOptions: {
    moveMenuItemText: "Move",
    closeMenuItemText: "Close",
    menu: ContextualMenu,
    isBlocking: false,
  },
};
const dialogContentProps = {
  type: DialogType.normal,
  title: "Select area to export",
  closeButtonAriaLabel: "Close",
  subText: "",
};

export const BoundsSelector = () => {
  const { showAnimationPanel } = useExploreSelector(s => s.map);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      isOpen={showAnimationPanel}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    />
  );
};
