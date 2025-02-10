import "swiper/swiper-bundle.css";

import { usePlayerAvatar } from "@/hooks/usePlayerAvatar";
import { Avatar, Container, IconButton } from "@chakra-ui/react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import styles from "./AvatarScrollPicker.module.css";
import { Navigation } from "swiper/modules";
import { useEffect, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export const AvatarScrollPicker = ({
  initialAvatarIndex,
  setAvatarIndex,
}: {
  initialAvatarIndex?: number;
  setAvatarIndex: (avatarIndex: number) => void;
}) => {
  const swipeRef = useRef<SwiperClass | null>(null);
  const { data: avatarNames, getAvatarImageSrcForIndex } = usePlayerAvatar();

  useEffect(() => {
    if (swipeRef.current && initialAvatarIndex !== undefined) {
      console.log(initialAvatarIndex);
      swipeRef.current.slideTo(initialAvatarIndex + 2);
    }
  }, [initialAvatarIndex]);

  return (
    <Container fluid p={0}>
      <Swiper
        loop
        modules={[Navigation]}
        spaceBetween={40}
        slidesPerView={3}
        centeredSlides
        onSlideChangeTransitionEnd={(swiper) => {
          setAvatarIndex(swiper.realIndex);
        }}
        onSwiper={(swipe) => {
          swipeRef.current = swipe;
        }}
      >
        {avatarNames.map((avatarName, index) => {
          return (
            <SwiperSlide className={styles.swiper_slide}>
              {({ isActive }) => (
                <Avatar.Root
                  className={
                    isActive ? styles.active_slide : styles.inactive_slide
                  }
                  //   style={{
                  //     transition: "scale 200ms, opacity 200ms",
                  //     scale: isActive ? "1" : "0.6",
                  //     opacity: isActive ? "1" : ".4",
                  //   }}
                  variant="subtle"
                  size="2xl"
                  key={avatarName}
                >
                  <Avatar.Image
                    marginTop={1}
                    src={getAvatarImageSrcForIndex(index)}
                  />
                  <Avatar.Fallback>SA</Avatar.Fallback>
                </Avatar.Root>
              )}
            </SwiperSlide>
          );
        })}

        <IconButton
          style={{
            marginTop: "-5rem",
            marginLeft: "27%",
          }}
          onClick={() => {
            swipeRef.current?.slidePrev();
          }}
          variant="subtle"
          zIndex={1}
          size="xs"
        >
          <IconArrowLeft />
        </IconButton>
        <IconButton
          zIndex={1}
          size="xs"
          variant="subtle"
          style={{
            marginTop: "-5rem",
            marginLeft: "27%",
          }}
          onClick={() => {
            swipeRef.current?.slideNext();
          }}
        >
          <IconArrowRight />
        </IconButton>
      </Swiper>
    </Container>
  );
};
