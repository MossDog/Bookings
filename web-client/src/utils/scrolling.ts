import { format } from "date-fns";

export const updateScrollGradients = (
  container: HTMLElement,
  leftGradient: HTMLElement | null,
  rightGradient: HTMLElement | null
) => {
  if (container.scrollLeft === 0) {
    leftGradient?.classList.add("hidden");
  } else {
    leftGradient?.classList.remove("hidden");
  }

  if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
    rightGradient?.classList.add("hidden");
  } else {
    rightGradient?.classList.remove("hidden");
  }
};

export const updateProgressDots = (
  container: HTMLElement,
  dots: NodeListOf<Element>
) => {
  const totalDots = dots.length;
  const scrollFraction =
    container.scrollLeft / (container.scrollWidth - container.clientWidth);
  const activeDotIndex = Math.round(scrollFraction * (totalDots - 1));
  
  dots.forEach((dot, index) => {
    dot.classList.toggle("bg-primary", index === activeDotIndex);
    dot.classList.toggle("bg-base-content/30", index !== activeDotIndex);
  });
};

export const isDateAvailable = (date: Date, availableDates: Date[]) =>
  availableDates.some(
    (available) =>
      format(available, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );