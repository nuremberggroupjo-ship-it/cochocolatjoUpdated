'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

export type Category = {
  id: string;
  name: string;
  thumbnailImage: string;
};

function SortableItem({ category }: { category: Category }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-gray-300 bg-white p-4 rounded-md flex flex-col items-center justify-center text-center"
    >
      <Image
        src={category.thumbnailImage}
        alt={category.name}
        width={400}
        height={128}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <span className="font-semibold">{category.name}</span>
    </div>
  );
}

export function CategorySorter({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCategories, setSavedCategories] = useState<Category[]>(initialCategories);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over?.id);

      const newOrder = arrayMove(categories, oldIndex, newIndex);
      setCategories(newOrder);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/categories/reorder', {
        orderedIds: categories.map((c) => c.id),
      });
      setSavedCategories(categories);
      router.push('/categories');
    } catch (error) {
      console.error('Error saving category order:', error);
      alert('Failed to save the order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isChanged =
    JSON.stringify(categories.map((c) => c.id)) !== JSON.stringify(savedCategories.map((c) => c.id));

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-4 mb-6 items-center">
            {categories.map((category) => (
              <SortableItem key={category.id} category={category} />
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
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  );
}
