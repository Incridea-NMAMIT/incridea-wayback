import './WormholeLoader.css';
import { useImagePreload } from './useImagePreload.ts';

interface WormholeLoaderProps {
    isVisible?: boolean;
    onComplete?: () => void;
}

const IMAGES_TO_PRELOAD = ['/wormholeloader/portal_expand.png', '/wormholeloader/portal-mobile.png', '/wormholeloader/cockpit.png', '/i.png'];

const WormholeLoader = ({ isVisible = true }: WormholeLoaderProps) => {
    const { imagesLoaded } = useImagePreload(IMAGES_TO_PRELOAD);

    // Not rendered until images are preloaded
    if (!isVisible || !imagesLoaded) return null;

    return (
        <>
            <div className="wormhole-loader-container">
                <div className="wormhole-portal-background">
                    <div className="portal-rotation-wrapper">
                        <picture>
                            <source media="(max-width: 768px)" srcSet="/wormholeloader/portal-mobile.png" />
                            <img
                                src="/wormholeloader/portal_expand.png"
                                alt=""
                                className="portal-background-image"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        </picture>
                    </div>
                </div>

                {/* Star Particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`star-${i}`}
                        className="star-layer"
                        style={{
                            animationDelay: `${i * 0.375}s`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        } as React.CSSProperties}
                    />
                ))}

                <img src="/wormholeloader/cockpit.png" className="cockpit-overlay" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />

                <img src="/i.png" className="i-totem" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </div>
        </>
    );
};

export default WormholeLoader;