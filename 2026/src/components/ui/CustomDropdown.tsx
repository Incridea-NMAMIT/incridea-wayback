import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    dropUp?: boolean;
    maxHeight?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    error,
    dropUp = false,
    maxHeight,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm sm:text-xs border transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${error
                        ? "border-red-500/50 bg-red-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }
        `}
            >
                <span className={selectedOption ? "text-white" : "text-white/40"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: dropUp ? 4 : -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: dropUp ? 4 : -4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 w-full rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl shadow-black/50 ${dropUp ? "bottom-full mb-1" : "mt-1"} ${maxHeight ? "overflow-y-auto scrollbar-none" : "overflow-hidden"}`}
                        style={maxHeight ? { maxHeight, scrollbarWidth: "none", msOverflowStyle: "none" } : undefined}
                    >
                        <div className="py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm sm:text-xs transition-colors
                    ${value === option.value
                                            ? "bg-white/10 text-white"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                        }
                  `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="text-red-400 text-xs sm:text-[10px] mt-1">{error}</p>
            )}
        </div>
    );
};

export default CustomDropdown;
