import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "../../lib/utils.js";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { ColourfulText } from "../../components/ui/colourful-text.jsx";

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 80);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(12px)" : "none",
        backgroundColor: visible ? "rgba(18, 18, 18, 0.65)" : "transparent",
        y: visible ? 6 : 0,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 30 }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between rounded-full px-6 py-3 lg:flex",
        "text-sm font-medium transition-colors duration-200",
        visible ? "border border-white/10 shadow-lg" : "",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-4 lg:flex",
        "text-neutral-400 hover:text-white transition-colors duration-200",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          key={`link-${idx}`}
          href={item.link}
          className="relative px-4 py-2 transition-colors duration-200"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500/10 to-orange-500/10"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        backgroundColor: visible ? "rgba(18, 18, 18, 0.7)" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 150, damping: 25 }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-4 py-2 lg:hidden",
        "rounded-xl",
        visible ? "border border-white/10 shadow-md" : "",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => (
  <div className={cn("flex w-full flex-row items-center justify-between", className)}>
    {children}
  </div>
);

export const MobileNavMenu = ({ children, className, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute inset-x-0 top-16 z-50 flex flex-col items-start gap-4 rounded-lg",
          "bg-neutral-900/90 backdrop-blur-md border border-white/10",
          "px-6 py-6 shadow-lg",
          className
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({ isOpen, onClick }) =>
  isOpen ? (
    <IconX className="text-white cursor-pointer" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-white cursor-pointer" onClick={onClick} />
  );

export const NavbarLogo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-1 px-3 py-1 text-xl font-bold tracking-tight transition-transform duration-200 hover:scale-105"
  ><span className="text-sm text-[#FF6900]">◆</span>
    <span className="text-white">Prepverse.</span>
    <span className="text-[#FF6900]">AI</span>
  </a>
);


export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-5 py-2 rounded-full text-sm font-semibold relative transition-all duration-200";

  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105",
    secondary: "bg-transparent border border-white/20 text-white hover:bg-white/10",
    dark: "bg-black text-white shadow-md hover:shadow-lg hover:scale-105",
  };

  return (
    <Tag
      href={href}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
