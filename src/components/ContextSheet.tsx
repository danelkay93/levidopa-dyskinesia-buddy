import type { ReactNode } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { useMediaQuery } from '@/app/use-media-query';
import { Button } from '@/components/ui/Button';

export function ContextSheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();

  if (wide) {
    return open
      ? <aside className="context-panel" aria-label={title}>
          <div className="context-panel__head"><Heading slot="title">{title}</Heading><Button variant="icon" aria-label="Close details" onPress={onClose}><XIcon size={22}/></Button></div>
          {children}
        </aside>
      : <aside className="context-panel context-panel--empty" aria-label="Selection details"><p>Select a dose or period to see its explanation here.</p></aside>;
  }

  return <AnimatePresence initial={!reduced}>{open ? <ModalOverlay isOpen isDismissable onOpenChange={(value) => { if (!value) onClose(); }} className="sheet-overlay">
    <Modal className="sheet-modal">
      <Dialog aria-label={title} className="sheet-dialog">
        <motion.div
          className="sheet-motion"
          initial={reduced ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: 30, opacity: 0 }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
        >
          <div className="sheet-handle" aria-hidden="true" />
          <div className="context-panel__head"><Heading slot="title">{title}</Heading><Button variant="icon" aria-label="Close details" onPress={onClose}><XIcon size={22}/></Button></div>
          {children}
        </motion.div>
      </Dialog>
    </Modal>
  </ModalOverlay> : null}</AnimatePresence>;
}
