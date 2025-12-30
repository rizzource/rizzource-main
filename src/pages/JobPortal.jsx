import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { track } from "@/lib/analytics"; // KEEP Mixpanel
import { usePostHog } from 'posthog-js/react'; // ADD PostHog

import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Scale,
  Heart
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useDispatch, useSelector } from "react-redux";
import { getScrappedJobs } from "@/redux/slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import { getFavoriteJobs, RemoveFavoriteJob, saveFavoriteJob, setSelectedJob } from "../redux/slices/userApiSlice";
import { toast, Toaster } from "sonner";

const JobPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posthog = usePostHog(); // ADD PostHog hook

  const { scrappedJobs, loading, favoriteJobs, user } = useSelector(
    (state) => state.userApi
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [areaOfLawFilter, setAreaOfLawFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;

  // FETCH JOBS ON MOUNT
  useEffect(() => {
    const isFavoritesView = window.location.href.includes("favoritejobs");

    if (isFavoritesView) {
      dispatch(getFavoriteJobs());
      track("FavoritesViewed"); // KEEP Mixpanel
      posthog?.capture('favorites_page_viewed'); // ADD PostHog
    } else {
      dispatch(getScrappedJobs());
      track("JobPortalViewed"); // KEEP Mixpanel
      posthog?.capture('$pageview'); // ADD PostHog
    }
  }, [dispatch, posthog]);

  // Auto-select Georgia AFTER jobs load
  useEffect(() => {
    if ((scrappedJobs?.length > 0 || favoriteJobs?.length > 0) && !stateFilter) {
      setStateFilter("Georgia");
      track("AutoStateFilterApplied", { state: "Georgia" }); // KEEP Mixpanel
      // No PostHog tracking for auto-filter (too granular)
    }
  }, [scrappedJobs, favoriteJobs, stateFilter]);

  const US_STATE_ABBR = new Set([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
    "VA", "WV", "WI", "WY", "DC"
  ]);

  const US_STATE_FULL = new Set([
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "North Carolina", "North Dakota",
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "West Virginia", "Wisconsin", "Wyoming",
    "District of Columbia"
  ]);

  const isState = (value) =>
    US_STATE_ABBR.has(value) || US_STATE_FULL.has(value);

  const parseLocations = (locationStr) => {
    if (!locationStr) return [];

    const parts = locationStr.split(",").map(p => p.trim());
    const result = [];

    let i = 0;
    while (i < parts.length) {
      const current = parts[i];
      const next = parts[i + 1];

      if (
        current === "Washington" &&
        next &&
        /^(d\.?c\.?)$/i.test(next.replace(/\s+/g, ""))
      ) {
        result.push("Washington, D.C.");
        i += 2;
        continue;
      }

      if (next && isState(next)) {
        result.push(`${current}, ${next}`);
        i += 2;
        continue;
      }

      result.push(current);
      i += 1;
    }

    return result;
  };

  const extractState = (location = "") => {
    if (!location) return null;
    const loc = location.toLowerCase();

    const cityToState = {
      "atlanta": "Georgia",
      "miami": "Florida",
      "boston": "Massachusetts",
      "chicago": "Illinois",
      "new york": "New York",
      "los angeles": "California",
      "san francisco": "California",
      "silicon valley": "California",
      "charlotte": "North Carolina",
      "raleigh": "North Carolina",
      "washington": "District of Columbia",
      "philadelphia": "Pennsylvania",
      "houston": "Texas",
      "dallas": "Texas",
      "ann arbor": "Michigan",
      "grand rapids": "Michigan",
      "columbus": "Ohio",
      "minneapolis": "Minnesota",
      "denver": "Colorado",
      "hartford": "Connecticut",
      "st. louis": "Missouri",
      "des moines": "Iowa"
    };

    for (const city in cityToState) {
      if (loc.includes(city)) return cityToState[city];
    }

    const abbrMap = {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
      DC: "District of Columbia"
    };

    const abbrMatch = location.match(/,\s*([A-Z]{2})$/);
    if (abbrMatch) {
      const abbr = abbrMatch[1];
      return abbrMap[abbr] || null;
    }

    const internationalMap = {
      "kalifornien": "California",
      "georgia": "Georgia",
      "massachusetts": "Massachusetts",
      "illinois": "Illinois",
      "florida": "Florida",
      "texas": "Texas",
      "virginia": "Virginia",
      "minnesota": "Minnesota",
      "ohio": "Ohio",
      "indiana": "Indiana",
      "pennsylvanien": "Pennsylvania",
      "pennsylvania": "Pennsylvania",
      "new york": "New York",
      "north carolina": "North Carolina",
      "south carolina": "South Carolina",
      "kalifornia": "California"
    };

    for (const keyword in internationalMap) {
      if (loc.includes(keyword)) return internationalMap[keyword];
    }

    return null;
  };

  // FILTER & SPLIT logic (unchanged)
  const jobsToDisplay = window.location.href.includes("favoritejobs")
    ? favoriteJobs
    : scrappedJobs;

  const filteredJobs = jobsToDisplay.filter((job) => {
    const matchesSearch = !searchQuery ||
      job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.firmName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase());

    const jobState = extractState(job.location);
    const matchesState = !stateFilter || jobState === stateFilter;

    const matchesArea = !areaOfLawFilter ||
      job.areaOfLaw?.includes(areaOfLawFilter);

    return matchesSearch && matchesState && matchesArea;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIdx, endIdx);

  const statesList = Array.from(
    new Set(
      jobsToDisplay
        .map((job) => extractState(job.location))
        .filter(Boolean)
    )
  ).sort();

  const splitAreas = Array.from(
    new Set(
      jobsToDisplay.flatMap((job) =>
        job.areaOfLaw ? job.areaOfLaw.split(/,|\//).map((a) => a.trim()) : []
      )
    )
  ).sort();

  const areasOfLaw = ["All Areas", ...splitAreas];

  const resetFilters = () => {
    setSearchQuery("");
    setStateFilter("");
    setAreaOfLawFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const toggleFavorite = async (jobId) => {
    if (!user) {
      toast.error("Please sign in to save favorite jobs");
      return;
    }
    try {
      const result = await dispatch(saveFavoriteJob({ jobId }));
      if (result.error) {
        toast.error("Failed to save favorite job. Please try again.");
        return;
      }
      toast.success("Saved to your favorites!");
      window.location.reload();
    } catch (err) {
      console.error("Favorite job error:", err);
      toast.error("Something went wrong while saving your job.");
    }
  };

  const deleteFavoriteJob = async (jobId) => {
    if (!user) {
      toast.error("Please sign in to save favorite jobs");
      return;
    }
    try {
      const result = await dispatch(RemoveFavoriteJob({ jobId }));
      if (result.error) {
        toast.error("Failed to remove from favorites. Please try again.");
        return;
      }
      toast.success("Removed from your favorites!");
      window.location.reload();
    } catch (err) {
      console.error("Favorite job error:", err);
      toast.error("Something went wrong while saving your job.");
    }
  };

  return (
    <>
      <Toaster richColors closeButton position="top-center" />

      <Header />
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          {window.location.href.includes("favoritejobs") ? (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Favorites at a Glance
              </h1>
              <p className="text-muted-foreground text-lg">
                Review, prioritize, and apply faster with your curated job list.
              </p>
            </div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Every 1L Law-Firm Role. One Smart Search.
              </h1>
              <p className="text-muted-foreground text-lg">
                Currently serving Georgia and New York —{" "}
                {user && "click on job details to "}explore AI résumé and cover-letter tools {!user ? "when you join ✨" : "✨"}
              </p>
            </div>
          )}

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  track("JobSearchPerformed", { query: e.target.value }); // KEEP Mixpanel
                  // No PostHog for search (too granular)
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={stateFilter}
              onValueChange={(v) => {
                setStateFilter(v);
                setCurrentPage(1);
                track("StateFilterChanged", { state: v }); // KEEP Mixpanel
                // No PostHog for filter changes (too granular)
              }}
            >
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {statesList.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {splitAreas.length > 0 && (
              <Select
                value={areaOfLawFilter}
                onValueChange={(v) => {
                  setAreaOfLawFilter(v);
                  setCurrentPage(1);
                  track("AreaOfLawFilterChanged", { area: v }); // KEEP Mixpanel
                  // No PostHog for filter changes (too granular)
                }}
              >
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Area of Law" />
                </SelectTrigger>
                <SelectContent className="max-h-74 overflow-y-auto">
                  {areasOfLaw.map((area) => (
                    <SelectItem
                      key={area}
                      value={area}
                      className="max-w-[260px] truncate"
                    >
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button size="lg" onClick={resetFilters} className="md:w-48 rounded-xl">
              Reset Filters
            </Button>
          </div>

          {/* JOB LISTING */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No jobs found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="hover:shadow-lg cursor-pointer transition"
                    onClick={() => {
                      dispatch(setSelectedJob(job));

                      // KEEP Mixpanel tracking
                      track("JobViewed", {
                        jobId: job.id,
                        title: job.jobTitle,
                        firm: job.firmName,
                      });

                      // ADD PostHog tracking
                      posthog?.capture('job_card_clicked', {
                        job_id: job.id,
                        job_title: job.jobTitle,
                        company: job.firmName,
                        location: job.location,
                        source: job.source || 'scraped',
                        has_deadline: !!job.applicationDeadline
                      });

                      navigate(`/jobs/${job.id}`);
                    }}
                  >
                    <CardHeader className="relative">
                      <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground">{job.firmName || "Not Specified"}</p>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {job.jobDescription || "No description available."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                          <div className="flex flex-wrap gap-2">
                            {parseLocations(job.location).map((loc, index) => (
                              <Badge key={index} variant="outline">
                                <MapPin className="h-3 w-3 mr-1" />
                                {loc}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {job.areaOfLaw && (
                          <Badge variant="outline">
                            <Scale className="h-3 w-3 mr-1" />
                            {job.areaOfLaw}
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.applicationDeadline || "Not Specified"}
                        </span>

                        <Button
                          size="sm"
                          variant="default"
                          className="rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedJob(job));

                            // KEEP Mixpanel tracking
                            track("JobDetailsViewed", {
                              jobId: job.id,
                              title: job.jobTitle,
                            });

                            navigate(`/jobs/${job.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                {getPaginationRange().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobPortal;