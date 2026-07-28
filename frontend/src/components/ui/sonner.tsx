import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner"

interface ToasterProps extends SonnerProps {}

const Toaster: React.FC<ToasterProps> = ({ ...props }) => {
  const { theme } = useTheme()

  const sonnerTheme: "system" | "light" | "dark" = 
    theme === "light" || theme === "dark" ? theme : "system"

  return (
    <Sonner
      theme={sonnerTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
