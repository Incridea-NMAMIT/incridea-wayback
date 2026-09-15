import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean = true) => {
    useEffect(() => {
        if (!isLocked) return;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Revert on cleanup
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLocked]);
};
