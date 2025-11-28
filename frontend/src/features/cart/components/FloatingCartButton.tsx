import { Button, Badge } from "@chakra-ui/react";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCartContext";
import { CartDrawer } from "./CartDrawer";
import { purple, pink } from "../../common/theme/colorScheme";

export function FloatingCartButton() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Button
        onClick={() => setIsCartOpen(true)}
        position="fixed"
        bottom="2rem"
        right="2rem"
        w="4rem"
        h="4rem"
        borderRadius="full"
        bg={purple}
        color="white"
        boxShadow="0 8px 24px rgba(0, 0, 0, 0.3)"
        _hover={{
          bg: pink,
          transform: "scale(1.1)",
        }}
        transition="all 0.3s"
        zIndex={1500}
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <Badge
            position="absolute"
            top="-5px"
            right="-5px"
            bg={pink}
            color="white"
            borderRadius="full"
            fontSize="sm"
            minW="28px"
            h="28px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.4)"
          >
            {totalItems}
          </Badge>
        )}
      </Button>
    </>
  );
}
