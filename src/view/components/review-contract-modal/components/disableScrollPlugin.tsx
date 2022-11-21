import { Plugin, RenderViewer, Slot } from '@react-pdf-viewer/core';

export const disableScrollPlugin = (): Plugin => {
  const renderViewer = (props: RenderViewer): Slot => {
    const { slot } = props;

    if (slot.subSlot && slot.subSlot.attrs && slot.subSlot.attrs.style) {
      slot.subSlot.attrs.style = { ...slot.subSlot.attrs.style, overflow: 'hidden' };
    }

    return slot;
  };

  return {
    renderViewer,
  };
};
