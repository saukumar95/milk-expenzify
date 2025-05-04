"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";

export interface MilkEntry {
  id: string;
  date: string;
  quantity: number;
  price: number;
  total: number;
}

interface UserSettings {
  milk_price: number;
  vendor_name: string;
  vendor_contact: string | null;
  vendor_address: string | null;
}

interface MilkDataContextType {
  entries: MilkEntry[];
  milkPrice: number;
  vendorName: string;
  vendorContact: string;
  vendorAddress: string;
  isLoading: boolean;
  user: any | null;
  setUser: (user: any | null) => void;
  addEntry: (entry: Omit<MilkEntry, "id">) => Promise<void>;
  updateEntry: (id: string, entry: Partial<MilkEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setMilkPrice: (price: number) => Promise<void>;
  setVendorInfo: (info: {
    name: string;
    contact: string;
    address: string;
  }) => Promise<void>;
  getEntriesByDateRange: (startDate: Date, endDate: Date) => MilkEntry[];
  signOut: () => Promise<void>;
}

const MilkDataContext = createContext<MilkDataContextType | undefined>(
  undefined
);

export function MilkDataProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any | null>(null);
  const [entries, setEntries] = useState<MilkEntry[]>([]);
  const [milkPrice, setMilkPrice] = useState<number>(60);
  const [vendorName, setVendorName] = useState<string>("Local Milk Vendor");
  const [vendorContact, setVendorContact] = useState<string>("");
  const [vendorAddress, setVendorAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          setUser(session.user);
          if (!pathname.startsWith("/auth")) {
            await fetchUserData(session.user.id);
          }
        } else {
          setUser(null);
          if (!pathname.startsWith("/auth")) {
            router.replace("/auth/login");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        toast({
          title: "Error",
          description:
            "Failed to load user data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          if (!pathname.startsWith("/auth")) {
            await fetchUserData(session.user.id);
          }
        } else {
          setUser(null);
          // Clear all state
          setEntries([]);
          setMilkPrice(60);
          setVendorName("Local Milk Vendor");
          setVendorContact("");
          setVendorAddress("");
          if (!pathname.startsWith("/auth") && !isSigningOut) {
            router.replace("/auth/login");
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from("milk_entries")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (entriesError) throw entriesError;
      setEntries(entriesData || []);

      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (settingsData) {
        setMilkPrice(settingsData.milk_price);
        setVendorName(settingsData.vendor_name);
        setVendorContact(settingsData.vendor_contact || "");
        setVendorAddress(settingsData.vendor_address || "");
      } else {
        const { error: insertError } = await supabase
          .from("user_settings")
          .upsert({
            user_id: userId,
            milk_price: 60,
            vendor_name: "Local Milk Vendor",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        if (insertError) throw insertError;
        
        setMilkPrice(60);
        setVendorName("Local Milk Vendor");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const addEntry = async (entry: Omit<MilkEntry, "id">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("milk_entries")
        .insert({
          user_id: user.id,
          date: entry.date,
          quantity: entry.quantity,
          price: entry.price,
          total: entry.total,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error adding entry:", error);
      toast({
        title: "Error",
        description: "Failed to add entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateEntry = async (id: string, updatedEntry: Partial<MilkEntry>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("milk_entries")
        .update({
          ...updatedEntry,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        )
      );
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({
        title: "Error",
        description: "Failed to update entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("milk_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMilkPrice = async (price: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          milk_price: price,
          vendor_name: vendorName,
          vendor_contact: vendorContact || null,
          vendor_address: vendorAddress || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setMilkPrice(price);
    } catch (error) {
      console.error("Error updating milk price:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateVendorInfo = async (info: {
    name: string;
    contact: string;
    address: string;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        milk_price: milkPrice,
        vendor_name: info.name,
        vendor_contact: info.contact || null,
        vendor_address: info.address || null,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setVendorName(info.name);
      setVendorContact(info.contact);
      setVendorAddress(info.address);
    } catch (error) {
      console.error("Error updating vendor info:", error);
      toast({
        title: "Error",
        description: "Failed to update vendor information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all local state immediately
      setUser(null);
      setEntries([]);
      setMilkPrice(60);
      setVendorName("Local Milk Vendor");
      setVendorContact("");
      setVendorAddress("");

      // Navigate to login
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSigningOut(false);
    }
  };

  return (
    <MilkDataContext.Provider
      value={{
        entries,
        milkPrice,
        vendorName,
        vendorContact,
        vendorAddress,
        isLoading,
        user,
        setUser,
        addEntry,
        updateEntry,
        deleteEntry,
        setMilkPrice: updateMilkPrice,
        setVendorInfo: updateVendorInfo,
        getEntriesByDateRange,
        signOut,
      }}
    >
      {children}
    </MilkDataContext.Provider>
  );
}

export function useMilkData() {
  const context = useContext(MilkDataContext);
  if (context === undefined) {
    throw new Error("useMilkData must be used within a MilkDataProvider");
  }
  return context;
}
