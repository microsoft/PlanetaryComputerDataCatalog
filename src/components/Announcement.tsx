import { IconButton, Stack, useTheme } from "@fluentui/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { marked } from "marked";

import { IAnnouncementType } from "types/index";
import announcementConfig from "config/announcements.yml";
import { useState } from "react";

dayjs.extend(isBetween);

const today = dayjs();
const announcements: IAnnouncementType[] = announcementConfig;

const Announcement = () => {
  const theme = useTheme();
  const [, setDismissed] = useState<string>();

  const toShow = announcements.filter
    ? announcements.filter(ann => {
        // Check to see if a hide value for this announcement is saved in
        // local storage, meaning the user previously dismissed it
        const value = window.localStorage.getItem(`hide-announcement-${ann.id}`);
        if (value) return false;

        const start = dayjs(ann.startDate);
        const end = dayjs(ann.endDate);
        return today.isBetween(start, end, null, "[)");
      })
    : null;

  if (!toShow?.length) return null;

  const handleDismiss = (id: string) => {
    return () => {
      // Persist the dismissal of this notice
      window.localStorage.setItem(`hide-announcement-${id}`, "true");
      setDismissed(id);
    };
  };

  return (
    <Stack
      className="announcements"
      style={{
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        padding: theme.spacing.s2,
      }}
    >
      {toShow.map((item, idx) => (
        <Stack.Item key={`announce-${idx}`} align="center">
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <div
              dangerouslySetInnerHTML={{ __html: marked.parseInline(item.content) }}
            />
            <IconButton
              primary
              styles={{
                root: {
                  color: theme.palette.white,
                  height: 20,
                  width: 20,
                },
                iconHovered: {
                  background: theme.palette.themePrimary,
                  color: theme.palette.white,
                },
              }}
              iconProps={{ iconName: "StatusCircleErrorX" }}
              title="Dismiss"
              aria-label="Dismiss"
              onClick={handleDismiss(item.id)}
            />
          </Stack>
        </Stack.Item>
      ))}
    </Stack>
  );
};

export default Announcement;
