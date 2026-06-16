export default function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div
      className="
      relative
      overflow-hidden

      bg-white/10
      backdrop-blur-2xl

      border
      border-white/10

      rounded-3xl

      p-6

      hover:scale-[1.03]
      hover:border-cyan-400/40
      hover:shadow-cyan-500/20
      hover:shadow-2xl

      transition-all
      duration-300
      "
    >

      {/* Glow Effect */}

      <div
        className="
        absolute
        -top-10
        -right-10

        w-32
        h-32

        bg-cyan-500/10
        blur-3xl
        rounded-full
        "
      />

      <div className="relative z-10 flex justify-between items-center">

        <div>

          <p
            className="
            text-slate-300
            text-sm
            uppercase
            tracking-wider
            "
          >
            {title}
          </p>

          <h2
            className="
            text-white
            text-4xl
            font-bold
            mt-3
            "
          >
            {value}
          </h2>

        </div>

        <div
          className="
          w-16
          h-16

          rounded-2xl

          bg-gradient-to-r
          from-cyan-500
          to-purple-600

          flex
          items-center
          justify-center

          shadow-lg
          "
        >

          <Icon
            size={30}
            className="text-white"
          />

        </div>

      </div>

    </div>
  );
}