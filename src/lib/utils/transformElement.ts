export function transformElement(element: HTMLElement, attribute: string) {
  const id = element.getAttribute(attribute);
  if (id) {
    const subElement = document.getElementById(id);
    if (subElement) {
      const computedHeight = parseFloat(getComputedStyle(subElement).height);
      if (computedHeight > 0) {
        subElement.style.height = `${subElement.scrollHeight}px`;
        requestAnimationFrame(() => {
          subElement.style.height = "0";
        });
      } else {
        subElement.style.height = "0";
        requestAnimationFrame(() => {
          subElement.style.height = `${subElement.scrollHeight}px`;
        });
        const handleTransitionEnd = () => {
          subElement.style.height = "auto";
          subElement.removeEventListener("transitionend", handleTransitionEnd);
        };
        subElement.addEventListener("transitionend", handleTransitionEnd);
      }
    }
  }
}
