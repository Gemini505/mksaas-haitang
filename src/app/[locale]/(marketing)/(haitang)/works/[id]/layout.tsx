import Container from '@/components/layout/container';

interface WorkLayoutProps {
  children: React.ReactNode;
}

export default async function WorkLayout({ children }: WorkLayoutProps) {
  return (
    <Container className="mt-8 mb-16 flex flex-col gap-12 px-4">
      <div className="flex flex-col md:flex-row gap-8">{children}</div>
    </Container>
  );
}
