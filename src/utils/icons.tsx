import React from "react";
import { registerIcons } from "@fluentui/react/lib/Styling";

const OptionIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 9a2 2 0 011.94 1.5h5.56a.5.5 0 01.09 1H7.94a2 2 0 01-3.88 0H2.5a.5.5 0 01-.09-1H4.06A2 2 0 016 9zm4-6a2 2 0 011.94 1.5h1.56a.5.5 0 01.09 1H11.94a2 2 0 01-3.88 0H2.5a.5.5 0 01-.09-1H8.06A2 2 0 0110 3z"></path>
  </svg>
);

const GlobeLocationIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7.31842 6.5C7.48643 5.62692 7.71458 4.84269 7.98747 4.17997C8.28942 3.44666 8.6363 2.88614 8.99591 2.51675C9.35398 2.14894 9.69311 2 10 2C10.3069 2 10.646 2.14894 11.0041 2.51675C11.3637 2.88614 11.7106 3.44666 12.0125 4.17997C12.2854 4.84269 12.5136 5.62692 12.6816 6.5H7.31842ZM7.06279 3.79922C7.30036 3.22224 7.57693 2.70725 7.89053 2.28104C5.65108 2.89163 3.80285 4.45074 2.80423 6.5H6.3012C6.48315 5.49258 6.74205 4.57814 7.06279 3.79922ZM12.9372 3.79922C12.6996 3.22225 12.4231 2.70725 12.1095 2.28105C14.3489 2.89163 16.1972 4.45074 17.1958 6.5H13.6988C13.5169 5.49258 13.2579 4.57814 12.9372 3.79922ZM13.85 7.5H17.6016C17.8601 8.28655 18 9.12694 18 10C18 10.0301 17.9998 10.0601 17.9995 10.0901C17.1852 9.41019 16.1438 9 15 9C14.6497 9 14.309 9.03848 13.9815 9.11138C13.9585 8.5586 13.914 8.01982 13.85 7.5ZM10.2627 13.5C10.2543 13.618 10.25 13.7371 10.25 13.8571C10.25 14.9467 10.6639 15.9925 11.3926 17.0013C11.2659 17.187 11.1358 17.3479 11.0041 17.4832C10.646 17.8511 10.3069 18 10 18C9.69311 18 9.35398 17.8511 8.99591 17.4832C8.6363 17.1139 8.28942 16.5533 7.98747 15.82C7.71458 15.1573 7.48643 14.3731 7.31842 13.5H10.2627ZM10.4386 12.5C10.8216 11.1545 11.7596 10.0412 12.9927 9.45263C12.9745 8.77427 12.9228 8.1202 12.8421 7.5H7.15793C7.0557 8.28549 7 9.1253 7 10C7 10.8747 7.0557 11.7145 7.15793 12.5H10.4386ZM2.80423 13.5C3.80285 15.5493 5.65107 17.1084 7.89053 17.719C7.57693 17.2928 7.30036 16.7778 7.06279 16.2008C6.74205 15.4219 6.48315 14.5074 6.3012 13.5H2.80423ZM6.14996 12.5H2.39838C2.13985 11.7135 2 10.8731 2 10C2 9.12694 2.13985 8.28655 2.39838 7.5H6.14996C6.0521 8.2949 6 9.13416 6 10C6 10.8658 6.0521 11.7051 6.14996 12.5ZM15 10C17.0711 10 18.75 11.7269 18.75 13.8571C18.75 15.4537 17.5668 17.127 15.25 18.9143C15.1019 19.0286 14.8981 19.0286 14.75 18.9143C12.4332 17.127 11.25 15.4537 11.25 13.8571C11.25 11.7269 12.9289 10 15 10ZM15 12.5714C14.3096 12.5714 13.75 13.1471 13.75 13.8571C13.75 14.5672 14.3096 15.1429 15 15.1429C15.6904 15.1429 16.25 14.5672 16.25 13.8571C16.25 13.1471 15.6904 12.5714 15 12.5714Z"></path>
  </svg>
);

const LayerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M10.5045 3.11661C10.1924 2.93379 9.80585 2.93379 9.49372 3.11661L3.48483 6.63608C2.82456 7.02281 2.82557 7.97759 3.48667 8.36292L9.49556 11.8652C9.80676 12.0466 10.1915 12.0466 10.5027 11.8652L16.5116 8.36292C17.1727 7.97759 17.1737 7.02281 16.5134 6.63608L10.5045 3.11661Z" />
    <path d="M3.07073 9.65002L9.50875 13.2724C9.81322 13.4438 10.185 13.4438 10.4895 13.2724L16.9275 9.65003C17.1145 10.0883 16.9757 10.6395 16.5116 10.91L10.5027 14.4123C10.1915 14.5937 9.80676 14.5937 9.49556 14.4123L3.48667 10.91C3.02254 10.6395 2.88376 10.0883 3.07073 9.65002Z" />
    <path d="M3.07073 12.103L9.50875 15.7254C9.81322 15.8967 10.185 15.8967 10.4895 15.7254L16.9275 12.103C17.1145 12.5413 16.9757 13.0924 16.5116 13.363L10.5027 16.8653C10.1915 17.0467 9.80676 17.0467 9.49556 16.8653L3.48667 13.363C3.02254 13.0924 2.88376 12.5412 3.07073 12.103Z" />
  </svg>
);

const FluentFilterIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12.25 13.5C12.6642 13.5 13 13.8358 13 14.25C13 14.6642 12.6642 15 12.25 15H7.75C7.33579 15 7 14.6642 7 14.25C7 13.8358 7.33579 13.5 7.75 13.5H12.25ZM14.25 9.25C14.6642 9.25 15 9.58579 15 10C15 10.4142 14.6642 10.75 14.25 10.75H5.75C5.33579 10.75 5 10.4142 5 10C5 9.58579 5.33579 9.25 5.75 9.25H14.25ZM16.25 5C16.6642 5 17 5.33579 17 5.75C17 6.16421 16.6642 6.5 16.25 6.5H3.75C3.33579 6.5 3 6.16421 3 5.75C3 5.33579 3.33579 5 3.75 5H16.25Z" />
  </svg>
);

const LegendIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15.25 0C16.7688 0 18 1.23122 18 2.75V15.25C18 16.7688 16.7688 18 15.25 18H2.75C1.23122 18 0 16.7688 0 15.25V2.75C0 1.23122 1.23122 0 2.75 0H15.25ZM15.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V15.25C1.5 15.9404 2.05964 16.5 2.75 16.5H15.25C15.9404 16.5 16.5 15.9404 16.5 15.25V2.75C16.5 2.05964 15.9404 1.5 15.25 1.5ZM11.25 8.5H3.75L3.64823 8.50685C3.28215 8.55651 3 8.8703 3 9.25C3 9.66421 3.33579 10 3.75 10H11.25L11.3518 9.99315C11.7178 9.94349 12 9.6297 12 9.25C12 8.83579 11.6642 8.5 11.25 8.5ZM3.75 12.5H14.25C14.6642 12.5 15 12.8358 15 13.25C15 13.6297 14.7178 13.9435 14.3518 13.9932L14.25 14H3.75C3.33579 14 3 13.6642 3 13.25C3 12.8703 3.28215 12.5565 3.64823 12.5068L3.75 12.5ZM14.25 4.5H3.75L3.64823 4.50685C3.28215 4.55651 3 4.8703 3 5.25C3 5.66421 3.33579 6 3.75 6H14.25L14.3518 5.99315C14.7178 5.94349 15 5.6297 15 5.25C15 4.83579 14.6642 4.5 14.25 4.5Z" />
  </svg>
);

const SearchIcon = (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.74832 13.5841 10.8995 12.8834 11.8226L17.0303 15.9697C17.3232 16.2626 17.3232 16.7374 17.0303 17.0303C16.7641 17.2966 16.3474 17.3208 16.0538 17.1029L15.9697 17.0303L11.8226 12.8834C10.8995 13.5841 9.74832 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4.5C6.29086 4.5 4.5 6.29086 4.5 8.5C4.5 10.7091 6.29086 12.5 8.5 12.5C10.7091 12.5 12.5 10.7091 12.5 8.5C12.5 6.29086 10.7091 4.5 8.5 4.5Z" />
  </svg>
);

const SettingsIcon = (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.91075 7.38266C2.28004 6.24053 2.88839 5.19213 3.69109 4.30364C3.82683 4.15339 4.03978 4.09984 4.23044 4.16802L6.14873 4.85392C6.6688 5.03977 7.24107 4.76883 7.42692 4.24875C7.4452 4.19762 7.45927 4.14507 7.469 4.09173L7.83446 2.08573C7.8708 1.88627 8.02398 1.7285 8.22227 1.6863C8.80246 1.5628 9.39734 1.5 10 1.5C10.6023 1.5 11.1968 1.56273 11.7767 1.68607C11.9749 1.72824 12.1281 1.88591 12.1645 2.08529L12.531 4.09165C12.6301 4.63497 13.1509 4.9951 13.6942 4.89601C13.7476 4.88627 13.8002 4.87219 13.8512 4.85395L15.7696 4.16802C15.9602 4.09984 16.1732 4.15339 16.3089 4.30364C17.1116 5.19213 17.72 6.24053 18.0893 7.38266C18.1516 7.57534 18.0915 7.78658 17.9371 7.91764L16.3823 9.23773C15.9613 9.5952 15.9098 10.2263 16.2673 10.6473C16.3024 10.6887 16.3409 10.7271 16.3823 10.7623L17.9371 12.0824C18.0915 12.2134 18.1516 12.4247 18.0893 12.6173C17.72 13.7595 17.1116 14.8079 16.3089 15.6964C16.1732 15.8466 15.9602 15.9002 15.7696 15.832L13.8513 15.1461C13.3312 14.9602 12.759 15.2312 12.5731 15.7512C12.5548 15.8024 12.5408 15.8549 12.531 15.9085L12.1645 17.9147C12.1281 18.1141 11.9749 18.2718 11.7767 18.3139C11.1968 18.4373 10.6023 18.5 10 18.5C9.39734 18.5 8.80246 18.4372 8.22227 18.3137C8.02398 18.2715 7.8708 18.1137 7.83446 17.9143L7.46902 15.9084C7.36993 15.365 6.84916 15.0049 6.30583 15.104C6.25241 15.1137 6.19987 15.1278 6.14881 15.1461L4.23044 15.832C4.03978 15.9002 3.82683 15.8466 3.69109 15.6964C2.88839 14.8079 2.28004 13.7595 1.91075 12.6173C1.84845 12.4247 1.90852 12.2134 2.06289 12.0824L3.61773 10.7623C4.03872 10.4048 4.09021 9.77373 3.73274 9.35274C3.69759 9.31135 3.65913 9.27288 3.61775 9.23775L2.06289 7.91764C1.90852 7.78658 1.84845 7.57534 1.91075 7.38266ZM8.00001 10C8.00001 11.1046 8.89544 12 10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89544 8 8.00001 8.89543 8.00001 10Z" />
  </svg>
);

export const registerCustomIcons = () => {
  registerIcons({
    icons: {
      Options: OptionIcon,
      GlobeLocation: GlobeLocationIcon,
      Layer: LayerIcon,
      FluentFilter: FluentFilterIcon,
      MapLegend: LegendIcon,
      FluentSearch: SearchIcon,
      FluentSettings: SettingsIcon,
    },
  });
};
