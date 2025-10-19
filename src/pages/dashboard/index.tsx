import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHeader } from "@/contexts/HeaderContext";
import { ReactElement, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogOut, BookOpen, Layers, Users, GraduationCap } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";

type OverviewType = {
  count: {
    articles: number;
    article_categories: number;
  };
  current_headmaster: {
    personnel: {
      name: string;
      image_url: string;
    };
    start_year: number;
    end_year: number;
  };
  current_year_stat: {
    year: number;
    students: number;
    classes: number;
    teachers: number;
  };
};

function DashboardHomeContent() {
  const { setTitle } = useHeader();
  const [overview, setOverview] = useState<OverviewType>({
    count: { articles: 0, article_categories: 0 },
    current_headmaster: {
      personnel: {
        name: "",
        image_url: "",
      },
      start_year: 0,
      end_year: 0,
    },
    current_year_stat: {
      year: 0,
      students: 0,
      classes: 0,
      teachers: 0,
    },
  });
  const { user, logout } = useAuth();

  const fetchOverviewData = async () => {
    try {
      const overviewData = await apiClient.get("/overview");

      setOverview(overviewData.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengambil data overview.");
    }
  };

  useEffect(() => {
    setTitle("Beranda");
    fetchOverviewData();
  }, [setTitle]);

  return (
    <div className="space-y-6">
      {/* Informasi Akun */}
      <Card className="flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Image
            src={user!.image_url}
            alt={user!.username}
            className="w-12 h-12 object-cover rounded-full border-2 border-gray-600"
            width={128}
            height={128}
          />
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-sm text-muted-foreground">
              {user?.role.join(", ")}
            </p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="destructive"
          className="flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </Card>

      {/* Overview Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Artikel</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.count.articles}</div>
            <p className="text-xs text-muted-foreground">
              Artikel terpublikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Kategori Artikel
            </CardTitle>
            <Layers className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.count.article_categories}
            </div>
            <p className="text-xs text-muted-foreground">Total kategori</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Siswa</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.current_year_stat.students.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tahun {overview.current_year_stat.year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Guru</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview.current_year_stat.teachers}
            </div>
            <p className="text-xs text-muted-foreground">Aktif tahun ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Kepala Sekolah Aktif */}
      <Card>
        <CardHeader>
          <CardTitle>Kepala Sekolah Aktif</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          {/* <Avatar className="w-16 h-16">
            <AvatarImage
              src={overview.current_headmaster.personnel.image_url}
            />
            <AvatarFallback>
              {overview.current_headmaster.personnel.name
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar> */}
          <Image
            src={overview.current_headmaster.personnel.image_url}
            alt={overview.current_headmaster.personnel.name}
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-600"
            width={128}
            height={128}
          />
          <div>
            <h3 className="font-semibold text-lg">
              {overview.current_headmaster.personnel.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Menjabat {overview.current_headmaster.start_year} –{" "}
              {overview.current_headmaster.end_year}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardHomePage() {
  return <DashboardHomeContent />;
}

DashboardHomePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
