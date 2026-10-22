import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Users,
  ClipboardList,
  ShieldCheck,
  CalendarDays,
  FileText,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  GraduationCap,
  Laptop,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Search,
  Bell,
  UserRound,
  Settings,
  CreditCard,
  Award,
  LogOut,
  Printer,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Home,
  Plus,
} from "lucide-react";
import "./style.css";

const courses = [
  {
    id: "basic",
    title: "বেসিক কম্পিউটার কোর্স",
    duration: "৩ মাস",
    fee: 3000,
    description: "কম্পিউটার ব্যবহারের প্রাথমিক ধারণা, টাইপিং ও অফিস অ্যাপ্লিকেশন।",
  },
  {
    id: "full",
    title: "ফুল কম্পিউটার কোর্স",
    duration: "৬ মাস",
    fee: 6000,
    description: "কম্পিউটার, অফিস অ্যাপ্লিকেশন, ইন্টারনেট ও প্রয়োজনীয় ব্যবহারিক শিক্ষা।",
  },
];

const emptyForm = {
  name: "",
  fatherName: "",
  motherName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  birthId: "",
  phone: "",
  alternatePhone: "",
  email: "",
  qualification: "",
  institution: "",
  passYear: "",
  presentAddress: "",
  permanentAddress: "",
  course: "basic",
  batch: "",
  classTime: "",
  guardianName: "",
  guardianPhone: "",
  photoName: "",
  consent: false,
};

const initialApplications = [
  {
    id: "BLC-DEMO-001",
    name: "নমুনা শিক্ষার্থী",
    fatherName: "নমুনা পিতা",
    motherName: "নমুনা মাতা",
    phone: "01XXXXXXXXX",
    email: "demo@example.com",
    course: "basic",
    status: "অপেক্ষমাণ",
    date: "2026-10-20",
    demo: true,
  },
];

function App() {
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [apps, setApps] = useState(initialApplications);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("সব");
  const [selectedApp, setSelectedApp] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [submittedId, setSubmittedId] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesSearch =
        !q ||
        app.name?.toLowerCase().includes(q) ||
        app.phone?.toLowerCase().includes(q) ||
        app.id?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "সব" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apps, search, statusFilter]);

  const totalApplications = apps.filter((a) => !a.demo).length;
  const pendingCount = apps.filter(
    (a) => a.status === "অপেক্ষমাণ"
  ).length;
  const approvedCount = apps.filter(
    (a) => a.status === "অনুমোদিত"
  ).length;
  const rejectedCount = apps.filter(
    (a) => a.status === "বাতিল"
  ).length;

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4000);
  }

  function updateForm(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      const file = files?.[0];

      if (file && file.size > 2 * 1024 * 1024) {
        notify("ছবির সাইজ সর্বোচ্চ ২ MB হতে পারবে।");
        event.target.value = "";
        return;
      }

      setForm((old) => ({
        ...old,
        photoName: file ? file.name : "",
      }));
      return;
    }

    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submitApplication(event) {
    event.preventDefault();

    if (!form.consent) {
      notify("আবেদন জমা দেওয়ার আগে সম্মতি দিন।");
      return;
    }

    const year = new Date().getFullYear();
    const id = `BLC-${year}-${String(
      apps.filter((a) => !a.demo).length + 1
    ).padStart(3, "0")}`;

    const newApplication = {
      ...form,
      id,
      status: "অপেক্ষমাণ",
      date: new Date().toISOString().slice(0, 10),
      demo: false,
    };

    setApps((old) => [newApplication, ...old]);
    setSubmittedId(id);
    setForm(emptyForm);
    notify("আবেদনটি এই ব্রাউজারের ডেমো অবস্থায় যোগ হয়েছে।");
  }

  function changeStatus(id, status) {
    setApps((old) =>
      old.map((app) => (app.id === id ? { ...app, status } : app))
    );

    if (selectedApp?.id === id) {
      setSelectedApp((old) => ({ ...old, status }));
    }

    notify(`আবেদনের অবস্থা পরিবর্তন করা হয়েছে: ${status}`);
  }

  function deleteApplication(id) {
    const confirmed = window.confirm(
      "আপনি কি এই ডেমো আবেদনটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    setApps((old) => old.filter((app) => app.id !== id));
    setSelectedApp(null);
    notify("ডেমো তালিকা থেকে আবেদনটি সরানো হয়েছে।");
  }

  function handleAdminLogin(event) {
    event.preventDefault();

    /*
      এটি শুধু ডেমো লগইন।
      আসল অ্যাডমিন নিরাপত্তার জন্য সার্ভার-ভিত্তিক
      authentication এবং role verification প্রয়োজন।
    */
    if (login.email.trim() && login.password.length >= 6) {
      setAdmin(true);
      setShowLogin(false);
      setPage("admin");
      setLogin({ email: "", password: "" });
      notify("ডেমো অ্যাডমিন প্যানেল খোলা হয়েছে।");
    } else {
      notify("ইমেইল দিন এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড লিখুন।");
    }
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenu(false);
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function courseName(id) {
    return courses.find((course) => course.id === id)?.title || id || "—";
  }

  function printApplication(app) {
    const win = window.open("", "_blank");

    if (!win) {
      notify("প্রিন্ট উইন্ডো খোলা যায়নি। ব্রাউজারের পপ-আপ অনুমতি দেখুন।");
      return;
    }

    const safe = (value) =>
      String(value || "—").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    win.document.write(`
      <!doctype html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>ভর্তি আবেদন ${safe(app.id)}</title>
        <style>
          body{font-family:Arial,sans-serif;padding:28px;color:#222}
          h1,h2{text-align:center}
          table{width:100%;border-collapse:collapse;margin-top:20px}
          td{border:1px solid #bbb;padding:9px}
          td:first-child{font-weight:bold;width:35%}
          .foot{margin-top:40px;display:flex;justify-content:space-between}
        </style>
      </head>
      <body>
        <h1>BLC Training Center</h1>
        <h2>ভর্তি আবেদনপত্র</h2>
        <p>আবেদন নম্বর: ${safe(app.id)}</p>
        <table>
          ${[
            ["শিক্ষার্থীর নাম", app.name],
            ["পিতার নাম", app.fatherName],
            ["মাতার নাম", app.motherName],
            ["জন্মতারিখ", app.dob],
            ["লিঙ্গ", app.gender],
            ["রক্তের গ্রুপ", app.bloodGroup],
            ["জন্মনিবন্ধন/NID", app.birthId],
            ["মোবাইল", app.phone],
            ["বিকল্প মোবাইল", app.alternatePhone],
            ["ইমেইল", app.email],
            ["শিক্ষাগত যোগ্যতা", app.qualification],
            ["প্রতিষ্ঠান", app.institution],
            ["পাসের বছর", app.passYear],
            ["বর্তমান ঠিকানা", app.presentAddress],
            ["স্থায়ী ঠিকানা", app.permanentAddress],
            ["কোর্স", courseName(app.course)],
            ["ব্যাচ", app.batch],
            ["ক্লাসের সময়", app.classTime],
            ["অভিভাবক", app.guardianName],
            ["অভিভাবকের ফোন", app.guardianPhone],
            ["আবেদনের অবস্থা", app.status],
          ]
            .map(
              ([label, value]) =>
                `<tr><td>${safe(label)}</td><td>${safe(value)}</td></tr>`
            )
            .join("")}
        </table>
        <div class="foot">
          <span>শিক্ষার্থীর স্বাক্ষর: __________</span>
          <span>কর্তৃপক্ষের স্বাক্ষর: __________</span>
        </div>
        <script>window.onload=()=>window.print()</script>
      </body>
      </html>
    `);

    win.document.close();
  }

  const Field = ({
    label,
    name,
    type = "text",
    required = false,
    options,
    placeholder,
  }) => (
    <label className="form-field">
      <span>
        {label} {required && <b className="required">*</b>}
      </span>

      {options ? (
        <select
          name={name}
          value={form[name]}
          onChange={updateForm}
          required={required}
        >
          <option value="">নির্বাচন করুন</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={type === "file" ? undefined : form[name]}
          onChange={updateForm}
          required={required}
          placeholder={placeholder || ""}
          accept={type === "file" ? "image/*" : undefined}
          maxLength={type === "tel" ? 20 : undefined}
        />
      )}
    </label>
  );

  const Metric = ({ icon: Icon, label, value, color }) => (
    <div className="metric-card">
      <div className={`metric-icon ${color || ""}`}>
        <Icon size={23} />
      </div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <article className="course-card">
      <div className="course-icon">
        <Laptop size={28} />
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-meta">
        <span><Clock3 size={16} /> {course.duration}</span>
        <strong>৳{course.fee}</strong>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setForm((old) => ({ ...old, course: course.id }));
          navigate("admission");
        }}
      >
        ভর্তি আবেদন করুন <ArrowRight size={17} />
      </button>
    </article>
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          href="#home"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            navigate("home");
          }}
        >
          <span className="brand-mark"><Laptop size={27} /></span>
          <span>
            <strong>BLC</strong>
            <small>Computer City & Training Center</small>
          </span>
        </a>

        <button
          className="mobile-menu-btn"
          aria-label="মেনু"
          onClick={() => setMobileMenu((old) => !old)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <nav className={mobileMenu ? "main-nav open" : "main-nav"}>
          {[
            ["home", "হোম"],
            ["courses", "কোর্সসমূহ"],
            ["admission", "ভর্তি আবেদন"],
            ["contact", "যোগাযোগ"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={page === key ? "nav-link active" : "nav-link"}
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}

          <button
            className="btn btn-primary admin-nav-btn"
            onClick={() => {
              if (admin) navigate("admin");
              else setShowLogin(true);
              setMobileMenu(false);
            }}
          >
            <ShieldCheck size={17} /> অ্যাডমিন
          </button>
        </nav>
      </header>

      {notice && (
        <div className="notice" role="status">
          <CheckCircle2 size={18} /> {notice}
          <button onClick={() => setNotice("")} aria-label="বন্ধ করুন">
            <X size={16} />
          </button>
        </div>
      )}

      <main>
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">BLC COMPUTER CITY & TRAINING CENTER</span>
                <h1>
                  দক্ষতা অর্জন করুন,
                  <br />
                  <span>গড়ুন সুন্দর ভবিষ্যৎ</span>
                </h1>
                <p>
                  আধুনিক কম্পিউটার প্রশিক্ষণ ও ব্যবহারিক শিক্ষার মাধ্যমে
                  আপনার দক্ষতা বাড়ান।
                </p>
                <div className="hero-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("admission")}
                  >
                    ভর্তি আবেদন করুন <ArrowRight size={18} />
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate("courses")}
                  >
                    কোর্স দেখুন
                  </button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-illustration">
                  <GraduationCap size={90} />
                  <Laptop size={120} />
                  <BookOpen size={54} />
                </div>
                <div className="floating-card">
                  <CheckCircle2 size={22} />
                  <span>দক্ষতা উন্নয়নের যাত্রা শুরু হোক আজই</span>
                </div>
              </div>
            </section>

            <section className="stats-strip">
              <div><Users size={25} /><strong>শিক্ষার্থী-কেন্দ্রিক</strong><span>সহযোগিতামূলক শিক্ষা</span></div>
              <div><Laptop size={25} /><strong>ব্যবহারিক প্রশিক্ষণ</strong><span>হাতে-কলমে শেখা</span></div>
              <div><Award size={25} /><strong>দক্ষতা উন্নয়ন</strong><span>ভবিষ্যতের প্রস্তুতি</span></div>
            </section>

            <section className="section-wrap">
              <div className="section-heading">
                <span className="eyebrow">আমাদের কোর্স</span>
                <h2>আপনার জন্য উপযুক্ত কোর্স বেছে নিন</h2>
                <p>আপনার প্রয়োজন অনুযায়ী প্রশিক্ষণ নির্বাচন করুন।</p>
              </div>
              <div className="course-grid">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <div className="center-action">
                <button className="btn btn-outline" onClick={() => navigate("courses")}>
                  সব কোর্স দেখুন <ArrowRight size={17} />
                </button>
              </div>
            </section>

            <section className="cta-section">
              <div>
                <h2>আজই আপনার শেখার যাত্রা শুরু করুন</h2>
                <p>ভর্তি ফরম পূরণ করে আপনার আবেদন জমা দিন।</p>
              </div>
              <button className="btn btn-light" onClick={() => navigate("admission")}>
                ভর্তি আবেদন <ArrowRight size={17} />
              </button>
            </section>
          </>
        )}

        {page === "courses" && (
          <section className="section-wrap page-wrap">
            <div className="page-title">
              <span className="eyebrow">শিখুন ও এগিয়ে যান</span>
              <h1>আমাদের কোর্সসমূহ</h1>
              <p>আপনার দক্ষতা ও সময় অনুযায়ী কোর্স নির্বাচন করুন।</p>
            </div>
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {page === "admission" && (
          <section className="section-wrap page-wrap">
            <div className="page-title">
              <span className="eyebrow">অনলাইন আবেদন</span>
              <h1>ভর্তি আবেদন ফরম</h1>
              <p>
                প্রয়োজনীয় তথ্য পূরণ করুন। সব তারকাচিহ্নিত তথ্য আবশ্যক।
              </p>
            </div>

            {submittedId && (
              <div className="success-panel">
                <CheckCircle2 size={42} />
                <h2>আবেদন জমা হয়েছে!</h2>
                <p>আপনার ডেমো আবেদন নম্বর:</p>
                <strong>{submittedId}</strong>
                <p>
                  এটি কেবল এই পেজের ডেমো। সার্ভারে স্থায়ীভাবে সংরক্ষিত হয়নি।
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSubmittedId("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  নতুন আবেদন করুন
                </button>
              </div>
            )}

            <form className="admission-form" onSubmit={submitApplication}>
              <div className="form-section-heading">
                <UserRound size={21} />
                <div><h3>১. ব্যক্তিগত তথ্য</h3><p>শিক্ষার্থীর সঠিক তথ্য লিখুন</p></div>
              </div>
              <div className="form-grid">
                <Field label="শিক্ষার্থীর পূর্ণ নাম" name="name" required />
                <Field label="পিতার নাম" name="fatherName" required />
                <Field label="মাতার নাম" name="motherName" required />
                <Field label="জন্মতারিখ" name="dob" type="date" required />
                <Field
                  label="লিঙ্গ"
                  name="gender"
                  required
                  options={[
                    { value: "পুরুষ", label: "পুরুষ" },
                    { value: "নারী", label: "নারী" },
                    { value: "অন্যান্য", label: "অন্যান্য" },
                  ]}
                />
                <Field
                  label="রক্তের গ্রুপ"
                  name="bloodGroup"
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (value) => ({ value, label: value })
                  )}
                />
                <Field label="জন্মনিবন্ধন/NID নম্বর" name="birthId" />
                <label className="form-field">
                  <span>শিক্ষার্থীর ছবি (সর্বোচ্চ ২ MB)</span>
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={updateForm}
                  />
                  {form.photoName && <small>{form.photoName}</small>}
                </label>
              </div>

              <div className="form-section-heading">
                <Phone size={21} />
                <div><h3>২. যোগাযোগের তথ্য</h3><p>সক্রিয় মোবাইল নম্বর দিন</p></div>
              </div>
              <div className="form-grid">
                <Field label="মোবাইল নম্বর" name="phone" type="tel" required />
                <Field label="বিকল্প মোবাইল নম্বর" name="alternatePhone" type="tel" />
                <Field label="ইমেইল ঠিকানা" name="email" type="email" />
                <Field label="অভিভাবকের নাম" name="guardianName" required />
                <Field label="অভিভাবকের ফোন নম্বর" name="guardianPhone" type="tel" required />
              </div>

              <div className="form-section-heading">
                <GraduationCap size={21} />
                <div><h3>৩. শিক্ষাগত যোগ্যতা</h3><p>সর্বশেষ শিক্ষাগত তথ্য দিন</p></div>
              </div>
              <div className="form-grid">
                <Field
                  label="শিক্ষাগত যোগ্যতা"
                  name="qualification"
                  required
                  options={[
                    { value: "প্রাথমিক", label: "প্রাথমিক" },
                    { value: "JSC", label: "JSC / সমমান" },
                    { value: "SSC", label: "SSC / সমমান" },
                    { value: "HSC", label: "HSC / সমমান" },
                    { value: "স্নাতক", label: "স্নাতক" },
                    { value: "অন্যান্য", label: "অন্যান্য" },
                  ]}
                />
                <Field label="প্রতিষ্ঠানের নাম" name="institution" />
                <Field label="পাসের বছর" name="passYear" type="number" />
              </div>

              <div className="form-section-heading">
                <MapPin size={21} />
                <div><h3>৪. ঠিকানা</h3><p>বর্তমান ও স্থায়ী ঠিকানা লিখুন</p></div>
              </div>
              <div className="form-grid">
                <Field label="বর্তমান ঠিকানা" name="presentAddress" required />
                <Field label="স্থায়ী ঠিকানা" name="permanentAddress" required />
              </div>

              <div className="form-section-heading">
                <BookOpen size={21} />
                <div><h3>৫. কোর্স ও ব্যাচ</h3><p>আপনার পছন্দের প্রশিক্ষণ নির্বাচন করুন</p></div>
              </div>
              <div className="form-grid">
                <Field
                  label="কোর্স নির্বাচন"
                  name="course"
                  required
                  options={courses.map((course) => ({
                    value: course.id,
                    label: `${course.title} — ৳${course.fee}`,
                  }))}
                />
                <Field
                  label="পছন্দের ব্যাচ"
                  name="batch"
                  required
                  options={[
                    { value: "সকাল", label: "সকাল" },
                    { value: "দুপুর", label: "দুপুর" },
                    { value: "বিকাল", label: "বিকাল" },
                    { value: "সন্ধ্যা", label: "সন্ধ্যা" },
                  ]}
                />
                <Field
                  label="ক্লাসের সময়"
                  name="classTime"
                  required
                  options={[
                    { value: "সকাল ৮টা–১০টা", label: "সকাল ৮টা–১০টা" },
                    { value: "সকাল ১০টা–১২টা", label: "সকাল ১০টা–১২টা" },
                    { value: "দুপুর ২টা–৪টা", label: "দুপুর ২টা–৪টা" },
                    { value: "বিকাল ৪টা–৬টা", label: "বিকাল ৪টা–৬টা" },
                  ]}
                />
              </div>

              <label className="consent-field">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={updateForm}
                  required
                />
                <span>
                  আমি নিশ্চিত করছি যে, দেওয়া তথ্য আমার জানা অনুযায়ী সঠিক।
                  ভর্তি কর্তৃপক্ষের যাচাইয়ের জন্য আমি সম্মতি দিচ্ছি।
                </span>
              </label>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  <ClipboardList size={18} /> আবেদন জমা দিন
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => setForm(emptyForm)}
                >
                  ফরম পরিষ্কার করুন
                </button>
              </div>
              <p className="form-note">
                গুরুত্বপূর্ণ: এই ফরমের তথ্য আপাতত শুধু পেজের ডেমো অবস্থায় থাকে।
                পেজ রিফ্রেশ করলে তথ্য হারিয়ে যেতে পারে।
              </p>
            </form>
          </section>
        )}

        {page === "contact" && (
          <section className="section-wrap page-wrap">
            <div className="page-title">
              <span className="eyebrow">যোগাযোগ</span>
              <h1>আমাদের সঙ্গে যোগাযোগ করুন</h1>
              <p>প্রশিক্ষণ ও ভর্তি সম্পর্কে জানতে যোগাযোগ করুন।</p>
            </div>
            <div className="contact-grid">
              <div className="contact-card">
                <Phone size={28} />
                <h3>ফোন</h3>
                <p>আপনার প্রতিষ্ঠানের ফোন নম্বর এখানে যোগ করুন।</p>
              </div>
              <div className="contact-card">
                <Mail size={28} />
                <h3>ইমেইল</h3>
                <p>আপনার প্রতিষ্ঠানের ইমেইল এখানে যোগ করুন।</p>
              </div>
              <div className="contact-card">
                <MapPin size={28} />
                <h3>ঠিকানা</h3>
                <p>আপনার প্রতিষ্ঠানের সম্পূর্ণ ঠিকানা এখানে যোগ করুন।</p>
              </div>
            </div>
            <div className="contact-card">
              <h3>ভর্তি আবেদন</h3>
              <p>অনলাইনে আবেদন করতে নিচের বোতাম চাপুন।</p>
              <button className="btn btn-primary" onClick={() => navigate("admission")}>
                আবেদন ফরম খুলুন <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {page === "admin" && admin && (
          <section className="admin-layout">
            <aside className="admin-sidebar">
              <div className="admin-brand">
                <ShieldCheck size={27} />
                <div><strong>BLC Admin</strong><small>Management Panel</small></div>
              </div>

              <p className="sidebar-label">মূল মেনু</p>
              <button className="sidebar-link active" onClick={() => setSelectedApp(null)}>
                <Home size={18} /> ড্যাশবোর্ড
              </button>
              <button className="sidebar-link" onClick={() => setSelectedApp(null)}>
                <ClipboardList size={18} /> ভর্তি আবেদন
              </button>
              <button className="sidebar-link" onClick={() => navigate("courses")}>
                <BookOpen size={18} /> কোর্সসমূহ
              </button>
              <button className="sidebar-link" onClick={() => notify("ব্যাচ ব্যবস্থাপনা পরবর্তী ধাপে তৈরি করতে হবে।")}>
                <CalendarDays size={18} /> ব্যাচ ব্যবস্থাপনা
              </button>
              <button className="sidebar-link" onClick={() => notify("ফি ব্যবস্থাপনার জন্য ডেটাবেস প্রয়োজন।")}>
                <CreditCard size={18} /> ফি ব্যবস্থাপনা
              </button>
              <button className="sidebar-link" onClick={() => notify("রিপোর্ট ব্যবস্থাপনা পরবর্তী ধাপে যোগ করা যাবে।")}>
                <FileText size={18} /> রিপোর্ট
              </button>
              <button className="sidebar-link" onClick={() => notify("সেটিংস পরবর্তী ধাপে তৈরি করতে হবে।")}>
                <Settings size={18} /> সেটিংস
              </button>

              <div className="sidebar-bottom">
                <button
                  className="sidebar-link"
                  onClick={() => {
                    setAdmin(false);
                    setPage("home");
                    setSelectedApp(null);
                  }}
                >
                  <LogOut size={18} /> লগআউট
                </button>
              </div>
            </aside>

            <div className="admin-main">
              <div className="admin-topbar">
                <div>
                  <span className="eyebrow">ADMINISTRATION</span>
                  <h1>অ্যাডমিন ড্যাশবোর্ড</h1>
                  <p>ভর্তি আবেদন ও শিক্ষার্থীর ডেমো তথ্য পরিচালনা করুন।</p>
                </div>
                <div className="admin-top-actions">
                  <button className="icon-button" onClick={() => notify("বর্তমানে নতুন নোটিফিকেশন নেই।")}>
                    <Bell size={20} />
                  </button>
                  <span className="admin-avatar"><UserRound size={22} /></span>
                </div>
              </div>

              <div className="demo-warning">
                <ShieldCheck size={21} />
                <div>
                  <strong>ডেমো অ্যাডমিন প্যানেল</strong>
                  <p>
                    এটি আসল নিরাপদ অ্যাডমিন সিস্টেম নয়। তথ্য ব্রাউজারের মেমোরিতে
                    থাকে; রিফ্রেশ করলে পরিবর্তন হারিয়ে যেতে পারে।
                  </p>
                </div>
              </div>

              <div className="metrics-grid">
                <Metric icon={Users} label="মোট আবেদন" value={totalApplications} color="blue" />
                <Metric icon={Clock3} label="অপেক্ষমাণ" value={pendingCount} color="orange" />
                <Metric icon={UserCheck} label="অনুমোদিত" value={approvedCount} color="green" />
                <Metric icon={UserX} label="বাতিল" value={rejectedCount} color="red" />
              </div>

              {selectedApp ? (
                <div className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>আবেদনের বিস্তারিত</h2>
                      <p>আবেদন নম্বর: {selectedApp.id}</p>
                    </div>
                    <button className="btn btn-outline" onClick={() => setSelectedApp(null)}>
                      <X size={17} /> তালিকায় ফিরুন
                    </button>
                  </div>

                  <div className="application-details">
                    {[
                      ["শিক্ষার্থীর নাম", selectedApp.name],
                      ["পিতার নাম", selectedApp.fatherName],
                      ["মাতার নাম", selectedApp.motherName],
                      ["জন্মতারিখ", selectedApp.dob],
                      ["লিঙ্গ", selectedApp.gender],
                      ["রক্তের গ্রুপ", selectedApp.bloodGroup],
                      ["জন্মনিবন্ধন/NID", selectedApp.birthId],
                      ["মোবাইল", selectedApp.phone],
                      ["বিকল্প মোবাইল", selectedApp.alternatePhone],
                      ["ইমেইল", selectedApp.email],
                      ["শিক্ষাগত যোগ্যতা", selectedApp.qualification],
                      ["প্রতিষ্ঠান", selectedApp.institution],
                      ["পাসের বছর", selectedApp.passYear],
                      ["বর্তমান ঠিকানা", selectedApp.presentAddress],
                      ["স্থায়ী ঠিকানা", selectedApp.permanentAddress],
                      ["কোর্স", courseName(selectedApp.course)],
                      ["ব্যাচ", selectedApp.batch],
                      ["ক্লাসের সময়", selectedApp.classTime],
                      ["অভিভাবকের নাম", selectedApp.guardianName],
                      ["অভিভাবকের ফোন", selectedApp.guardianPhone],
                      ["ছবির ফাইলের নাম", selectedApp.photoName],
                      ["আবেদনের তারিখ", selectedApp.date],
                      ["অবস্থা", selectedApp.status],
                    ].map(([label, value]) => (
                      <div className="detail-item" key={label}>
                        <span>{label}</span>
                        <strong>{value || "—"}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => changeStatus(selectedApp.id, "অনুমোদিত")}
                    >
                      <CheckCircle2 size={17} /> অনুমোদন
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => changeStatus(selectedApp.id, "বাতিল")}
                    >
                      <X size={17} /> বাতিল
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => printApplication(selectedApp)}
                    >
                      <Printer size={17} /> প্রিন্ট
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => deleteApplication(selectedApp.id)}
                    >
                      <Trash2 size={17} /> মুছুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>ভর্তি আবেদনসমূহ</h2>
                      <p>আবেদন দেখুন, খুঁজুন এবং অবস্থা পরিবর্তন করুন।</p>
                    </div>
                    <button className="btn btn-outline" onClick={() => navigate("admission")}>
                      <Plus size={17} /> নতুন আবেদন
                    </button>
                  </div>

                  <div className="table-toolbar">
                    <label className="search-box">
                      <Search size={18} />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="নাম, ফোন বা আবেদন নম্বর দিয়ে খুঁজুন"
                      />
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                    >
                      <option value="সব">সব আবেদন</option>
                      <option value="অপেক্ষমাণ">অপেক্ষমাণ</option>
                      <option value="অনুমোদিত">অনুমোদিত</option>
                      <option value="বাতিল">বাতিল</option>
                    </select>
                  </div>

                  <div className="table-responsive">
                    <table className="applications-table">
                      <thead>
                        <tr>
                          <th>আবেদন নম্বর</th>
                          <th>শিক্ষার্থীর নাম</th>
                          <th>মোবাইল</th>
                          <th>কোর্স</th>
                          <th>তারিখ</th>
                          <th>অবস্থা</th>
                          <th>কার্যক্রম</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((app) => (
                          <tr key={app.id}>
                            <td>{app.id}</td>
                            <td>{app.name}</td>
                            <td>{app.phone}</td>
                            <td>{courseName(app.course)}</td>
                            <td>{app.date}</td>
                            <td>
                              <span
                                className={`status-badge ${
                                  app.status === "অনুমোদিত"
                                    ? "approved"
                                    : app.status === "বাতিল"
                                    ? "rejected"
                                    : "pending"
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="icon-button"
                                  title="বিস্তারিত দেখুন"
                                  onClick={() => setSelectedApp(app)}
                                >
                                  <Eye size={17} />
                                </button>
                                <button
                                  className="icon-button"
                                  title="অনুমোদন"
                                  onClick={() => changeStatus(app.id, "অনুমোদিত")}
                                >
                                  <CheckCircle2 size={17} />
                                </button>
                                <button
                                  className="icon-button"
                                  title="বাতিল"
                                  onClick={() => changeStatus(app.id, "বাতিল")}
                                >
                                  <UserX size={17} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan="7" className="empty-state">
                              কোনো আবেদন পাওয়া যায়নি।
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="table-footer">
                    দেখানো হচ্ছে {filtered.length}টি আবেদন
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="brand-mark"><Laptop size={25} /></span>
            <div>
              <strong>BLC Training Center</strong>
              <p>দক্ষতা অর্জন করুন, সুন্দর ভবিষ্যৎ গড়ুন।</p>
            </div>
          </div>
          <div>
            <h3>দ্রুত লিংক</h3>
            <button onClick={() => navigate("home")}>হোম</button>
            <button onClick={() => navigate("courses")}>কোর্সসমূহ</button>
            <button onClick={() => navigate("admission")}>ভর্তি আবেদন</button>
          </div>
          <div>
            <h3>যোগাযোগ</h3>
            <p><Phone size={16} /> ফোন নম্বর যোগ করুন</p>
            <p><Mail size={16} /> ইমেইল যোগ করুন</p>
            <p><MapPin size={16} /> ঠিকানা যোগ করুন</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BLC Training Center. সর্বস্বত্ব সংরক্ষিত।</span>
        </div>
      </footer>

      {showLogin && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowLogin(false);
          }}
        >
          <form className="login-modal" onSubmit={handleAdminLogin}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowLogin(false)}
              aria-label="বন্ধ করুন"
            >
              <X size={21} />
            </button>
            <div className="login-icon"><ShieldCheck size={32} /></div>
            <h2>অ্যাডমিন লগইন</h2>
            <p>ডেমো অ্যাডমিন প্যানেল খুলতে তথ্য দিন।</p>

            <label className="form-field">
              <span>ইমেইল</span>
              <input
                type="email"
                value={login.email}
                onChange={(event) =>
                  setLogin((old) => ({ ...old, email: event.target.value }))
                }
                required
                autoComplete="username"
              />
            </label>
            <label className="form-field">
              <span>পাসওয়ার্ড</span>
              <input
                type="password"
                value={login.password}
                onChange={(event) =>
                  setLogin((old) => ({ ...old, password: event.target.value }))
                }
                required
                minLength={6}
                autoComplete="current-password"
              />
            </label>

            <button className="btn btn-primary login-submit" type="submit">
              লগইন করুন <ArrowRight size={18} />
            </button>
            <p className="login-warning">
              সতর্কতা: এটি পরীক্ষামূলক লগইন। যেকোনো ইমেইল এবং ৬ বা তার বেশি
              অক্ষরের পাসওয়ার্ডে প্রবেশ করা যাবে। এটি প্রকৃত নিরাপত্তা নয়।
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
