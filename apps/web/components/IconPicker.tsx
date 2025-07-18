import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Icon from "./Icon";
import { IconWeight } from "@phosphor-icons/react";
import IconPopover from "./IconPopover";
import clsx from "clsx";
import { Button } from "./ui/button";

type Props = {
  alignment?: string;
  color: string;
  setColor: Function;
  iconName?: string;
  setIconName: Function;
  weight: "light" | "regular" | "bold" | "fill" | "duotone" | "thin";
  setWeight: Function;
  hideDefaultIcon?: boolean;
  reset: Function;
  className?: string;
};

const IconPicker = ({
  alignment,
  color,
  setColor,
  iconName,
  setIconName,
  weight,
  setWeight,
  hideDefaultIcon,
  className,
  reset,
}: Props) => {
  const { t } = useTranslation();
  const [iconPicker, setIconPicker] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIconPicker(!iconPicker)}
        variant="ghost"
        className="w-20 h-20"
        size="icon"
      >
        {iconName ? (
          <Icon
            icon={iconName}
            size={60}
            weight={(weight || "regular") as IconWeight}
            color={color}
          />
        ) : !iconName && hideDefaultIcon ? (
          <p className="p-1">{t("set_custom_icon")}</p>
        ) : (
          <i className="bi-folder-fill text-6xl" style={{ color: color }}></i>
        )}
      </Button>
      {iconPicker && (
        <IconPopover
          alignment={alignment}
          color={color}
          setColor={setColor}
          iconName={iconName}
          setIconName={setIconName}
          weight={weight}
          setWeight={setWeight}
          reset={reset}
          onClose={() => setIconPicker(false)}
          className={clsx(
            className,
            alignment || "lg:-translate-x-1/3 top-20 left-0"
          )}
        />
      )}
    </div>
  );
};

export default IconPicker;
