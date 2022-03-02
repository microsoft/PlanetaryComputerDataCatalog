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

const SettingsIconFilled = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.2672 6.15302C2.52892 5.34708 2.96005 4.60729 3.52891 3.98033C3.62511 3.87431 3.77603 3.83652 3.91115 3.88463L5.27062 4.36863C5.6392 4.49978 6.04476 4.30859 6.17647 3.9416C6.18942 3.90551 6.1994 3.86844 6.20629 3.8308L6.46529 2.41527C6.49104 2.27452 6.5996 2.1632 6.74013 2.13341C7.1513 2.04627 7.57289 2.00195 8 2.00195C8.42685 2.00195 8.84818 2.04621 9.25912 2.13325C9.39961 2.16301 9.50816 2.27427 9.53397 2.41496L9.7937 3.83074C9.86392 4.21413 10.233 4.46825 10.618 4.39833C10.6559 4.39146 10.6931 4.38153 10.7293 4.36865L12.0888 3.88463C12.224 3.83652 12.3749 3.87431 12.4711 3.98033C13.04 4.60729 13.4711 5.34708 13.7328 6.15302C13.777 6.28899 13.7344 6.43805 13.625 6.53053L12.5231 7.46205C12.2247 7.7143 12.1882 8.1596 12.4416 8.45667C12.4665 8.48589 12.4937 8.51303 12.5231 8.53782L13.625 9.46935C13.7344 9.56183 13.777 9.71089 13.7328 9.84685C13.4711 10.6528 13.04 11.3926 12.4711 12.0196C12.3749 12.1256 12.224 12.1634 12.0888 12.1153L10.7294 11.6312C10.3608 11.5001 9.95524 11.6913 9.82353 12.0583C9.81058 12.0944 9.8006 12.1314 9.79368 12.1692L9.53397 13.5849C9.50816 13.7256 9.39961 13.8369 9.25912 13.8666C8.84818 13.9537 8.42685 13.9979 8 13.9979C7.57289 13.9979 7.1513 13.9536 6.74013 13.8665C6.5996 13.8367 6.49104 13.7254 6.46529 13.5846L6.2063 12.1691C6.13608 11.7857 5.76701 11.5316 5.38196 11.6015C5.3441 11.6084 5.30687 11.6184 5.27068 11.6312L3.91115 12.1153C3.77603 12.1634 3.62511 12.1256 3.52891 12.0196C2.96005 11.3926 2.52892 10.6528 2.2672 9.84685C2.22305 9.71089 2.26562 9.56183 2.37502 9.46935L3.47693 8.53783C3.77528 8.28558 3.81177 7.84027 3.55843 7.5432C3.53352 7.51399 3.50626 7.48685 3.47694 7.46206L2.37502 6.53053C2.26562 6.43805 2.22305 6.28899 2.2672 6.15302ZM6.24988 7.99988C6.24988 8.96638 7.03338 9.74988 7.99988 9.74988C8.96638 9.74988 9.74988 8.96638 9.74988 7.99988C9.74988 7.03338 8.96638 6.24988 7.99988 6.24988C7.03338 6.24988 6.24988 7.03338 6.24988 7.99988Z"
      fill="#83888d"
    />
  </svg>
);

const SettingsIcon = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.99994 6C6.89537 6 5.99994 6.89543 5.99994 8C5.99994 9.10457 6.89537 10 7.99994 10C9.10451 10 9.99994 9.10457 9.99994 8C9.99994 6.89543 9.10451 6 7.99994 6ZM6.99994 8C6.99994 7.44772 7.44765 7 7.99994 7C8.55222 7 8.99994 7.44772 8.99994 8C8.99994 8.55228 8.55222 9 7.99994 9C7.44765 9 6.99994 8.55228 6.99994 8ZM10.618 4.39833C10.233 4.46825 9.86392 4.21413 9.7937 3.83074L9.53397 2.41496C9.50816 2.27427 9.39961 2.16301 9.25912 2.13325C8.84818 2.04621 8.42685 2.00195 8 2.00195C7.57289 2.00195 7.1513 2.04627 6.74013 2.13341C6.5996 2.1632 6.49104 2.27452 6.46529 2.41527L6.20629 3.8308C6.1994 3.86844 6.18942 3.90551 6.17647 3.9416C6.04476 4.30859 5.6392 4.49978 5.27062 4.36863L3.91115 3.88463C3.77603 3.83652 3.62511 3.87431 3.52891 3.98033C2.96005 4.60729 2.52892 5.34708 2.2672 6.15302C2.22305 6.28899 2.26562 6.43805 2.37502 6.53053L3.47694 7.46206C3.50626 7.48685 3.53352 7.51399 3.55843 7.5432C3.81177 7.84027 3.77528 8.28558 3.47693 8.53783L2.37502 9.46935C2.26562 9.56183 2.22305 9.71089 2.2672 9.84685C2.52892 10.6528 2.96005 11.3926 3.52891 12.0196C3.62511 12.1256 3.77603 12.1634 3.91115 12.1153L5.27068 11.6312C5.30687 11.6184 5.3441 11.6084 5.38196 11.6015C5.76701 11.5316 6.13608 11.7857 6.2063 12.1691L6.46529 13.5846C6.49104 13.7254 6.5996 13.8367 6.74013 13.8665C7.1513 13.9536 7.57289 13.9979 8 13.9979C8.42685 13.9979 8.84818 13.9537 9.25912 13.8666C9.39961 13.8369 9.50816 13.7256 9.53397 13.5849L9.79368 12.1692C9.8006 12.1314 9.81058 12.0944 9.82353 12.0583C9.95524 11.6913 10.3608 11.5001 10.7294 11.6312L12.0888 12.1153C12.224 12.1634 12.3749 12.1256 12.4711 12.0196C13.04 11.3926 13.4711 10.6528 13.7328 9.84685C13.777 9.71089 13.7344 9.56183 13.625 9.46935L12.5231 8.53782C12.4937 8.51303 12.4665 8.48589 12.4416 8.45667C12.1882 8.1596 12.2247 7.71429 12.5231 7.46205L13.625 6.53053C13.7344 6.43805 13.777 6.28899 13.7328 6.15302C13.4711 5.34708 13.04 4.60729 12.4711 3.98033C12.3749 3.87431 12.224 3.83652 12.0888 3.88463L10.7293 4.36865C10.6931 4.38152 10.6559 4.39146 10.618 4.39833ZM3.99863 4.97726L4.93522 5.3107C5.82017 5.62559 6.79872 5.16815 7.11769 4.2794C7.14903 4.19207 7.17324 4.1021 7.18996 4.01078L7.36738 3.04113C7.5757 3.01512 7.78684 3.00195 8 3.00195C8.213 3.00195 8.42397 3.0151 8.63214 3.04107L8.81011 4.01117C8.98053 4.9408 9.87266 5.55003 10.7967 5.38225C10.8877 5.36572 10.9775 5.34176 11.0647 5.31073L12.0014 4.97726C12.2564 5.31084 12.4684 5.67476 12.6319 6.06064L11.8774 6.6984C11.1566 7.30787 11.0675 8.38649 11.6807 9.10555C11.7408 9.17609 11.8067 9.24166 11.8775 9.3015L12.6319 9.93924C12.4684 10.3251 12.2564 10.689 12.0014 11.0226L11.0646 10.6891C10.1797 10.3742 9.20128 10.8317 8.88231 11.7205C8.85096 11.8078 8.82677 11.8978 8.81004 11.9891L8.63214 12.9588C8.42397 12.9848 8.213 12.9979 8 12.9979C7.78684 12.9979 7.5757 12.9848 7.36738 12.9587L7.18994 11.989C7.01965 11.0592 6.12743 10.4498 5.2033 10.6176C5.11227 10.6342 5.0225 10.6581 4.93528 10.6892L3.99863 11.0226C3.74357 10.689 3.53161 10.3251 3.36814 9.93924L4.12257 9.30148C4.84343 8.69201 4.93254 7.61339 4.31933 6.89433C4.25917 6.82378 4.19332 6.75822 4.12254 6.69838L3.36814 6.06064C3.53161 5.67476 3.74357 5.31084 3.99863 4.97726Z"
      fill="#83888d"
    />
  </svg>
);

const View = (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.25909 9.60214C2.94254 6.32689 5.79437 4 9.00002 4C12.2057 4 15.0574 6.32688 15.7409 9.60215C15.7974 9.87246 16.0622 10.0459 16.3325 9.98946C16.6029 9.93304 16.7763 9.66817 16.7199 9.39785C15.9425 5.67312 12.6934 3 9.00002 3C5.3066 3 2.05742 5.67311 1.28017 9.39786C1.22377 9.66818 1.39718 9.93305 1.6675 9.98946C1.93782 10.0459 2.20268 9.87246 2.25909 9.60214ZM9 6C7.067 6 5.5 7.567 5.5 9.5C5.5 11.433 7.067 13 9 13C10.933 13 12.5 11.433 12.5 9.5C12.5 7.567 10.933 6 9 6ZM6.5 9.5C6.5 8.11929 7.61929 7 9 7C10.3807 7 11.5 8.11929 11.5 9.5C11.5 10.8807 10.3807 12 9 12C7.61929 12 6.5 10.8807 6.5 9.5Z"
      fill="#83888d"
    />
  </svg>
);

const UnView = (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.853553 0.146447C0.658291 -0.0488155 0.341709 -0.0488155 0.146447 0.146447C-0.0488155 0.341709 -0.0488155 0.658291 0.146447 0.853553L3.64526 4.35237C1.97039 5.49178 0.723337 7.27383 0.280114 9.39787C0.223706 9.66819 0.397116 9.93305 0.667436 9.98946C0.937755 10.0459 1.20262 9.87246 1.25903 9.60214C1.66284 7.66698 2.82362 6.06289 4.3671 5.07421L5.94894 6.65605C5.06509 7.29133 4.48947 8.32844 4.48947 9.5C4.48947 11.433 6.05647 13 7.98947 13C9.16103 13 10.1981 12.4244 10.8334 11.5405L15.1464 15.8536C15.3417 16.0488 15.6583 16.0488 15.8536 15.8536C16.0488 15.6583 16.0488 15.3417 15.8536 15.1464L0.853553 0.146447ZM8.12378 6.00253L11.4869 9.3657C11.418 7.5395 9.94997 6.07143 8.12378 6.00253ZM5.53104 3.4098L6.3341 4.21286C6.87141 4.07353 7.43009 4 7.99995 4C11.2056 4 14.0574 6.32688 14.7409 9.60215C14.7973 9.87247 15.0622 10.0459 15.3325 9.98946C15.6028 9.93304 15.7762 9.66817 15.7198 9.39786C14.9425 5.67312 11.6934 3 7.99995 3C7.14478 3 6.31342 3.14331 5.53104 3.4098Z"
      fill="#83888d"
    />
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
      FluentSettingsFilled: SettingsIconFilled,
      FluentSettings: SettingsIcon,
      FluentView: View,
      FluentUnview: UnView,
    },
  });
};
