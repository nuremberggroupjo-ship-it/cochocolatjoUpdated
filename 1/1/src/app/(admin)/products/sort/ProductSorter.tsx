'use client';

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ استيراد Image

export interface Product {
  id: string;
  name: string;
  thumbnailImage: string;
}

function SortableItem({ product }: { product: Product }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-gray-300 bg-white p-4 rounded-md flex flex-col items-center justify-center text-center shadow-sm"
    >
      <Image
        src={product.thumbnailImage}
        alt={product.name}
        width={400}
        height={128}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <span className="font-semibold">{product.name}</span>
    </div>
  );
}

export function ProductSorter({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProducts, setSavedProducts] = useState(initialProducts);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && !isSaving) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      setProducts((items) => arrayMove(items, oldIndex, newIndex));
    }
  }

  const isChanged =
    JSON.stringify(products.map((p) => p.id)) !==
    JSON.stringify(savedProducts.map((p) => p.id));

  async function handleSave() {
    setIsSaving(true);
    try {
      await axios.post("/api/products/reorder", {
        orderedIds: products.map((p) => p.id),
      });
      setSavedProducts(products);
      router.push("/shop-now");
    } catch (error) {
      console.error("Failed to save product order:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-4 mb-6 items-center">
            {products.map((product) => (
              <SortableItem key={product.id} product={product} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="text-center">
        <button
          onClick={handleSave}
          disabled={!isChanged || isSaving}
          className="mt-4 px-6 py-2 rounded bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
