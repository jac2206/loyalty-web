import { ProfileCard } from "@/features/user/components/ProfileCard";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto flex max-w-5xl justify-center">
        <ProfileCard />
      </section>
    </main>
  );
}
