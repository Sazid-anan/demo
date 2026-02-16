import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseClient";

const sanitizePayload = (payload) => {
  return Object.fromEntries(
    Object.entries(payload || {}).filter(([, value]) => value !== undefined),
  );
};

const normalizeHomePageBranding = (homePage) => {
  if (!homePage) return homePage;

  const legacyToNew = "Alchemy for the Intelligent Age";
  const legacyHeadlineValues = new Set([
    "Edge AI Solutions",
    "Edge AI Excellence",
  ]);

  const normalized = { ...homePage };

  if (legacyHeadlineValues.has(normalized.headline)) {
    normalized.headline = legacyToNew;
  }

  if (legacyHeadlineValues.has(normalized.section_title)) {
    normalized.section_title = legacyToNew;
  }

  return normalized;
};

/**
 * Async thunk to fetch content from Firebase
 * Fetches home page, products, and about us content
 */
export const fetchContent = createAsyncThunk(
  "content/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const [
        homeDoc,
        aboutDoc,
        servicesDoc,
        productsSnap,
        teamSnap,
        blogsSnap,
      ] = await Promise.all([
        getDoc(doc(db, "home_page", "singleton")),
        getDoc(doc(db, "about_page", "singleton")),
        getDoc(doc(db, "services_page", "singleton")),
        getDocs(query(collection(db, "products"), orderBy("name"))),
        getDocs(
          query(collection(db, "team_members"), orderBy("display_order")),
        ),
        getDocs(
          query(collection(db, "blogs"), orderBy("published_date", "desc")),
        ),
      ]);

      const products = productsSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      const teamMembers = teamSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      const blogs = blogsSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      return {
        homePage: homeDoc.exists()
          ? [{ id: homeDoc.id, ...homeDoc.data() }]
          : [],
        products,
        aboutPage: aboutDoc.exists()
          ? [{ id: aboutDoc.id, ...aboutDoc.data() }]
          : [],
        teamMembers,
        blogs,
        servicesPage: servicesDoc.exists()
          ? [{ id: servicesDoc.id, ...servicesDoc.data() }]
          : [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (arg, { getState }) => {
      const { content } = getState();
      if (content.loading) return false;

      const isForced = Boolean(arg && arg.force);
      if (isForced) return true;

      const now = Date.now();
      const lastFetched = content.lastFetched || 0;
      return now - lastFetched > 15000;
    },
  },
);

// Persist home page content to Firebase
export const saveHomePage = createAsyncThunk(
  "content/saveHomePage",
  async (payload, { rejectWithValue }) => {
    try {
      const { id: _id, ...rest } = payload || {};
      const payloadWithUpdatedAt = sanitizePayload({
        ...rest,
        updated_at: new Date().toISOString(),
      });

      const ref = doc(db, "home_page", "singleton");
      await setDoc(ref, payloadWithUpdatedAt, { merge: true });

      return { id: "singleton", ...payloadWithUpdatedAt };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Persist about page content in Firebase
export const saveAboutPage = createAsyncThunk(
  "content/saveAboutPage",
  async (payload, { rejectWithValue }) => {
    try {
      const { id: _id, ...rest } = payload || {};
      const payloadWithUpdatedAt = sanitizePayload({
        ...rest,
        updated_at: new Date().toISOString(),
      });

      const ref = doc(db, "about_page", "singleton");
      await setDoc(ref, payloadWithUpdatedAt, { merge: true });

      return { id: "singleton", ...payloadWithUpdatedAt };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Persist services page content in Firebase
export const saveServicesPage = createAsyncThunk(
  "content/saveServicesPage",
  async (payload, { rejectWithValue }) => {
    try {
      const { id: _id, ...rest } = payload || {};
      const payloadWithUpdatedAt = sanitizePayload({
        ...rest,
        updated_at: new Date().toISOString(),
      });

      const ref = doc(db, "services_page", "singleton");
      await setDoc(ref, payloadWithUpdatedAt, { merge: true });

      return { id: "singleton", ...payloadWithUpdatedAt };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Save a single product (upsert)
export const saveProduct = createAsyncThunk(
  "content/saveProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const isNewProduct =
        !payload.id || (typeof payload.id === "number" && payload.id < 1000000);

      if (isNewProduct) {
        const { id: _id, ...productData } = payload;
        const now = new Date().toISOString();
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          created_at: now,
          updated_at: now,
        });
        return { id: docRef.id, ...productData };
      }

      const { id, ...productData } = payload;
      const ref = doc(db, "products", String(id));
      await setDoc(
        ref,
        { ...productData, updated_at: new Date().toISOString() },
        { merge: true },
      );
      return { id: String(id), ...productData };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Delete a product by id
export const deleteProduct = createAsyncThunk(
  "content/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "products", String(id)));
      return String(id);
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Save a team member (upsert)
export const saveTeamMember = createAsyncThunk(
  "content/saveTeamMember",
  async (payload, { rejectWithValue }) => {
    try {
      const isNewMember = !payload.id || payload.id === "NEW";
      if (isNewMember) {
        const { id: _id, ...memberData } = payload;
        const now = new Date().toISOString();
        const docRef = await addDoc(collection(db, "team_members"), {
          ...memberData,
          created_at: now,
          updated_at: now,
        });
        return { id: docRef.id, ...memberData };
      }

      const { id, ...memberData } = payload;
      const ref = doc(db, "team_members", String(id));
      await setDoc(
        ref,
        { ...memberData, updated_at: new Date().toISOString() },
        { merge: true },
      );
      return { id: String(id), ...memberData };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Delete a team member by id
export const deleteTeamMember = createAsyncThunk(
  "content/deleteTeamMember",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "team_members", String(id)));
      return String(id);
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Save a blog post (upsert)
export const saveBlog = createAsyncThunk(
  "content/saveBlog",
  async (payload, { rejectWithValue }) => {
    try {
      const isNewBlog =
        !payload.id || (typeof payload.id === "number" && payload.id < 1000000);

      if (isNewBlog) {
        const { id: _id, ...blogData } = payload;
        const now = new Date().toISOString();
        const docRef = await addDoc(collection(db, "blogs"), {
          ...blogData,
          created_at: now,
          updated_at: now,
        });
        return { id: docRef.id, ...blogData };
      }

      const { id, ...blogData } = payload;
      const ref = doc(db, "blogs", String(id));
      await setDoc(
        ref,
        { ...blogData, updated_at: new Date().toISOString() },
        { merge: true },
      );
      return { id: String(id), ...blogData };
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

// Delete a blog post by id
export const deleteBlog = createAsyncThunk(
  "content/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "blogs", String(id)));
      return String(id);
    } catch (err) {
      return rejectWithValue(err.message || String(err));
    }
  },
);

/**
 * Content Slice
 * Manages all website content fetched from Firebase
 */
const contentSlice = createSlice({
  name: "content",
  initialState: {
    homePage: {
      headline: "Alchemy for the Intelligent Age",
      description: "Transform your products with intelligent edge computing",
      heroImages: [],
      hero_image_details: "",
      product_image_url: "",
      product_image_caption: "",
      product_image_link: "",
      // Removed main section fields
      capabilities_title: "",
      capability_1_title: "",
      capability_1_desc: "",
      capability_2_title: "",
      capability_2_desc: "",
      capability_3_title: "",
      capability_3_desc: "",
    },
    products: [],
    aboutPage: {
      title: "About Danvion Ltd.",
      description: "",
      mission: "",
      vision: "",
      story_paragraph_1: "",
      story_paragraph_2: "",
      story_paragraph_3: "",
    },
    teamMembers: [],
    blogs: [],
    servicesPage: {
      hero_title: "Edge AI Product Development",
      hero_description: "",
      services_section_title: "Our Services",
      service_1_icon: "",
      service_1_title: "",
      service_1_desc: "",
      service_2_icon: "",
      service_2_title: "",
      service_2_desc: "",
      service_3_icon: "",
      service_3_title: "",
      service_3_desc: "",
      service_4_icon: "",
      service_4_title: "",
      service_4_desc: "",
      service_5_icon: "",
      service_5_title: "",
      service_5_desc: "",
      service_6_icon: "",
      service_6_title: "",
      service_6_desc: "",
      process_section_title: "Our Development Process",
      process_1_title: "",
      process_1_desc: "",
      process_2_title: "",
      process_2_desc: "",
      process_3_title: "",
      process_3_desc: "",
      process_4_title: "",
      process_4_desc: "",
      cta_title: "Ready to Develop?",
      cta_description: "",
      cta_button_text: "Get Started Today",
    },
    lastFetched: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Update home page content
    updateHomePageContent: (state, action) => {
      state.homePage = { ...state.homePage, ...action.payload };
    },
    // Add/update product
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      } else {
        state.products.push(action.payload);
      }
    },
    // Remove product
    removeProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    // Update about page
    updateAboutPage: (state, action) => {
      state.aboutPage = { ...state.aboutPage, ...action.payload };
    },
    // Update team members
    updateTeamMembers: (state, action) => {
      state.teamMembers = action.payload;
    },
    // Define error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetched = Date.now();
        const fetchedHomePage = action.payload.homePage[0] || state.homePage;
        state.homePage = normalizeHomePageBranding(fetchedHomePage);
        state.products = action.payload.products;
        state.aboutPage = action.payload.aboutPage[0] || state.aboutPage;
        state.teamMembers = action.payload.teamMembers || [];
        state.blogs = action.payload.blogs || [];
        state.servicesPage =
          action.payload.servicesPage[0] || state.servicesPage;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveHomePage
      .addCase(saveHomePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveHomePage.fulfilled, (state, action) => {
        state.loading = false;
        state.homePage = action.payload || state.homePage;
      })
      .addCase(saveHomePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveAboutPage
      .addCase(saveAboutPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAboutPage.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutPage = action.payload || state.aboutPage;
      })
      .addCase(saveAboutPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveProduct
      .addCase(saveProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.loading = false;
        const prod = action.payload;
        if (!prod) return;
        const idx = state.products.findIndex((p) => p.id === prod.id);
        if (idx !== -1) state.products[idx] = prod;
        else state.products.push(prod);
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveTeamMember
      .addCase(saveTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const member = action.payload;
        if (!member) return;
        const idx = state.teamMembers.findIndex((m) => m.id === member.id);
        if (idx !== -1) state.teamMembers[idx] = member;
        else state.teamMembers.push(member);
      })
      .addCase(saveTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteTeamMember
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = state.teamMembers.filter(
          (m) => m.id !== action.payload,
        );
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveBlog
      .addCase(saveBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        } else {
          state.blogs.push(action.payload);
        }
        // Sort by published_date descending
        state.blogs.sort((a, b) => {
          const dateA = new Date(a.published_date || 0);
          const dateB = new Date(b.published_date || 0);
          return dateB - dateA;
        });
      })
      .addCase(saveBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteBlog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // saveServicesPage
      .addCase(saveServicesPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveServicesPage.fulfilled, (state, action) => {
        state.loading = false;
        state.servicesPage = action.payload || state.servicesPage;
      })
      .addCase(saveServicesPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateHomePageContent,
  updateProduct,
  removeProduct,
  updateAboutPage,
  updateTeamMembers,
  setError,
} = contentSlice.actions;

export default contentSlice.reducer;
