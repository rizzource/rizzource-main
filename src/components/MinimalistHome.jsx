import { Button } from "@/components/ui/button";
import { Scale, BookOpen, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";  
import Timeline from "./Timeline";

const MinimalistHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("🔑 Supabase Key (first 8 chars):", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8));
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 md:left-10 animate-float opacity-20">
          <Scale className="w-12 h-12 md:w-16 md:h-16 text-secondary" />
        </div>
        <div className="absolute top-40 right-4 md:right-20 animate-float-delayed opacity-20">
          <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-secondary" />
        </div>
        <div className="absolute bottom-40 left-4 md:left-20 animate-float opacity-20">
          <Users className="w-12 h-12 md:w-14 md:h-14 text-secondary" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 mobile-optimized py-20 min-h-screen flex items-center">
        <div className="w-full space-y-12">
          {/* Content Section */}
          <div className="text-center space-y-6 lg:space-y-8">
            {/* RIZZource Logo */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-border">
                <Scale className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-secondary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight break-words font-bold">
                <span className="text-accent">RIZZ</span>
                <span className="text-primary">ource</span>
              </h1>
            </div>
            
            <div style={{marginTop: -15}}>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto break-words">
                Resources and tools for tomorrow’s legal minds
              </p>
            </div>

            {/* View Matchups Button - only show when logged in */}
            {user && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => navigate('/matchup')}
                  size="lg"
                  className="relative overflow-hidden group px-10 py-4 text-lg font-bold rounded-2xl
                             bg-gradient-to-r from-accent to-secondary text-white shadow-md 
                             transition-all duration-300 ease-out
                             hover:shadow-xl hover:scale-105"
                >
                  <span className="relative z-10">View Matchups</span>
                  {/* Animated hover overlay */}
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></span>
                </Button>
              </div>
            )}
          </div>

          {/* Timeline Component */}
          {user && <Timeline />}
        </div>
      </div>
    </section>
  );
};

export default MinimalistHome;
