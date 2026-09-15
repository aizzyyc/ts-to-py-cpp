import type { LearningResource } from "./python-resources";

const cppReference: LearningResource = {
  title: "C++ reference",
  source: "cppreference",
  href: "https://en.cppreference.com/w/",
  note: "查阅语言规则、标准库类型和边界行为的精确定义。",
};

const learnCpp: LearningResource = {
  title: "LearnCpp.com",
  source: "LearnCpp 开放教程",
  href: "https://www.learncpp.com/",
  note: "用循序渐进的例子补充 C++ 语法、类型和工程基础。",
};

const cmake: LearningResource = {
  title: "CMake Tutorial",
  source: "CMake 官方文档",
  href: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html",
  note: "把课程中的编译命令整理成可维护的跨平台构建目标。",
};

const rosTutorials: LearningResource = {
  title: "ROS 2 tutorials",
  source: "ROS 2 官方文档",
  href: "https://docs.ros.org/en/jazzy/Tutorials.html",
  note: "按 workspace、节点、通信和工具顺序连接到真实 ROS 2 工程。",
};

const rosConcepts: LearningResource = {
  title: "ROS 2 concepts",
  source: "ROS 2 官方文档",
  href: "https://docs.ros.org/en/jazzy/Concepts.html",
  note: "理解 middleware、QoS、执行器和时间等 API 背后的系统模型。",
};

const cppResources: Record<string, LearningResource[]> = {
  "cpp-toolchain": [cmake, learnCpp],
  "cpp-syntax": [learnCpp, cppReference],
  "cpp-types": [
    { ...cppReference, title: "Fundamental types", href: "https://en.cppreference.com/w/cpp/language/types", note: "查阅整数、浮点、布尔和类型转换规则。" },
    { ...learnCpp, title: "Variables and fundamental data types", href: "https://www.learncpp.com/cpp-tutorial/variable-assignment-and-initialization/", note: "用短例子理解初始化、作用域和类型推导。" },
  ],
  "cpp-values": [
    { ...learnCpp, title: "References", href: "https://www.learncpp.com/cpp-tutorial/lvalue-references/", note: "从对象别名和参数传递建立引用直觉。" },
    { ...cppReference, title: "Pointers", href: "https://en.cppreference.com/w/cpp/language/pointer", note: "查阅指针、空指针和间接访问规则。" },
  ],
  "cpp-functions": [
    { ...learnCpp, title: "Function overloading and forward declarations", href: "https://www.learncpp.com/cpp-tutorial/function-overloading/", note: "补充声明、定义、重载和多文件组织。" },
    { ...cppReference, title: "One Definition Rule", href: "https://en.cppreference.com/w/cpp/language/definition", note: "定位头文件、重复定义和链接错误。" },
  ],
  "cpp-stl": [
    { ...learnCpp, title: "Introduction to std::vector", href: "https://www.learncpp.com/cpp-tutorial/an-introduction-to-stdvector/", note: "理解 vector 的元素、容量、迭代器和失效边界。" },
    { ...cppReference, title: "Containers library", href: "https://en.cppreference.com/w/cpp/container", note: "比较 sequence、associative 和 unordered 容器。" },
  ],
  "cpp-algorithms": [
    { ...cppReference, title: "Algorithms library", href: "https://en.cppreference.com/w/cpp/algorithm", note: "查阅 sort、find、transform 等算法的迭代器契约。" },
    { ...learnCpp, title: "Lambdas", href: "https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/", note: "从 JavaScript callback 迁移到捕获列表和调用对象。" },
  ],
  "cpp-raii": [
    { ...learnCpp, title: "Resource acquisition is initialization", href: "https://www.learncpp.com/cpp-tutorial/what-is-stdunique_ptr/", note: "从智能指针理解资源生命周期和异常安全。" },
    { ...cppReference, title: "std::unique_ptr", href: "https://en.cppreference.com/w/cpp/memory/unique_ptr", note: "查阅独占所有权、移动和自定义 deleter。" },
  ],
  "cpp-move": [
    { ...learnCpp, title: "Move constructors and assignment", href: "https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/", note: "通过可观察的拷贝计数理解资源转移。" },
    { ...cppReference, title: "Move constructors", href: "https://en.cppreference.com/w/cpp/language/move_constructor", note: "查阅右值、隐式生成和 noexcept 的关系。" },
  ],
  "cpp-exceptions": [
    { ...learnCpp, title: "Exception handling", href: "https://www.learncpp.com/cpp-tutorial/basic-exception-handling/", note: "比较异常、返回值和资源清理的边界。" },
    { ...cppReference, title: "Exceptions", href: "https://en.cppreference.com/w/cpp/language/exceptions", note: "查阅 throw、catch、栈展开和异常规格。" },
  ],
  "cpp-interfaces": [
    { ...learnCpp, title: "Classes and class members", href: "https://www.learncpp.com/cpp-tutorial/introduction-to-classes/", note: "从 TypeScript interface 迁移到不变量和实现边界。" },
    { ...cppReference, title: "Classes", href: "https://en.cppreference.com/w/cpp/language/classes", note: "查阅访问控制、虚函数和对象布局规则。" },
  ],
  "cpp-templates": [
    { ...learnCpp, title: "Function templates", href: "https://www.learncpp.com/cpp-tutorial/function-templates/", note: "将 TypeScript 泛型经验迁移到编译期实例化。" },
    { ...cppReference, title: "Constraints and concepts", href: "https://en.cppreference.com/w/cpp/language/constraints", note: "理解如何让模板错误更早、更可读。" },
  ],
  "cpp-ranges": [
    { ...cppReference, title: "Range library", href: "https://en.cppreference.com/w/cpp/ranges", note: "查阅 view、range adaptor 和惰性求值的生命周期。" },
    { ...learnCpp, title: "Range-based for loops", href: "https://www.learncpp.com/cpp-tutorial/introduction-to-ranged-for-loops/", note: "从数组遍历过渡到迭代器和 view 管线。" },
  ],
  "cpp-io": [
    { ...cppReference, title: "std::filesystem", href: "https://en.cppreference.com/w/cpp/filesystem", note: "查阅跨平台路径、目录和文件状态 API。" },
    { ...learnCpp, title: "Basic file I/O", href: "https://www.learncpp.com/cpp-tutorial/basic-file-io/", note: "用文件流和错误状态构造可验证的输入边界。" },
  ],
  "cpp-cmake-targets": [cmake, { title: "cmake-buildsystem", source: "CMake 官方文档", href: "https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html", note: "理解 target、include、link 和传递依赖。" }],
  "cpp-testing": [
    { title: "GoogleTest documentation", source: "GoogleTest 开源项目", href: "https://google.github.io/googletest/", note: "把纯函数、消息处理器和边界条件变成自动化测试。" },
    { title: "CTest documentation", source: "CMake 官方文档", href: "https://cmake.org/cmake/help/latest/manual/ctest.1.html", note: "让测试成为 CMake 构建的一部分。" },
  ],
  "cpp-sanitizers": [
    { title: "AddressSanitizer", source: "LLVM 官方文档", href: "https://clang.llvm.org/docs/AddressSanitizer.html", note: "定位 use-after-free、越界和 double-free。" },
    { title: "Instrumentation options", source: "GCC 官方文档", href: "https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html", note: "查阅 AddressSanitizer 和 UndefinedBehaviorSanitizer 开关。" },
  ],
  "cpp-concurrency": [
    { ...cppReference, title: "Thread support library", href: "https://en.cppreference.com/w/cpp/thread", note: "比较 thread、future、jthread 和执行同步。" },
    { ...learnCpp, title: "Multithreading", href: "https://www.learncpp.com/cpp-tutorial/introduction-to-threads/", note: "从事件循环迁移到线程生命周期和 join。" },
  ],
  "cpp-sync": [
    { ...cppReference, title: "Mutual exclusion", href: "https://en.cppreference.com/w/cpp/thread/mutex", note: "查阅 mutex、lock_guard 和锁的所有权。" },
    { ...cppReference, title: "std::atomic", href: "https://en.cppreference.com/w/cpp/atomic/atomic", note: "理解原子变量、内存序和适用边界。" },
  ],
  "cpp-queues": [
    { ...cppReference, title: "std::condition_variable", href: "https://en.cppreference.com/w/cpp/thread/condition_variable", note: "实现有界队列的等待、唤醒和退出协议。" },
    { ...learnCpp, title: "Circular buffers", href: "https://www.learncpp.com/cpp-tutorial/stdarray-and-enumeration/", note: "用固定容量容器思考传感器背压和内存预算。" },
  ],
  "cpp-performance": [
    { ...cppReference, title: "Object lifetime", href: "https://en.cppreference.com/w/cpp/language/lifetime", note: "把性能问题追溯到对象创建、拷贝和生命周期。" },
    { title: "Google Benchmark", source: "Google 开源项目", href: "https://github.com/google/benchmark", note: "用可重复基准比较拷贝、移动和数据布局。" },
  ],
  "cpp-realtime": [
    { ...cppReference, title: "Chrono library", href: "https://en.cppreference.com/w/cpp/chrono", note: "查阅 duration、steady_clock 和截止时间计算。" },
    { ...rosConcepts, title: "ROS 2 real-time programming", href: "https://docs.ros.org/en/jazzy/Tutorials/Demos/Real-Time-Programming.html", note: "理解实时回调、动态分配和执行器选择。" },
  ],
  "cpp-networking": [
    { title: "Boost.Asio documentation", source: "Boost 开源项目", href: "https://www.boost.org/doc/libs/release/doc/html/boost_asio.html", note: "比较异步 socket、超时和取消边界。" },
    rosConcepts,
  ],
  "cpp-ros-workspace": [rosTutorials, { title: "ament_cmake user documentation", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/How-To-Guides/Ament-CMake-Documentation.html", note: "查阅 ROS 2 包、依赖和 ament_cmake 约定。" }],
  "cpp-ros-topics": [rosTutorials, { title: "Writing a simple publisher and subscriber", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html", note: "从 C++ 节点、回调和消息队列开始。" }],
  "cpp-ros-services": [{ title: "Writing a simple service and client", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-CPP-Service-And-Client.html", note: "查阅同步请求、响应和失败处理。" }, { title: "ROS 2 actions", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Actions.html", note: "理解长任务、反馈、取消和结果。" }],
  "cpp-ros-params": [{ title: "ROS 2 parameters", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Concepts/Basic/About-Parameters.html", note: "查阅参数声明、类型和生命周期。" }, { title: "ROS 2 launch", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Launch/Creating-Launch-Files.html", note: "把节点装配和环境配置移出代码。" }],
  "cpp-ros-tf2": [{ title: "tf2 tutorials", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Tf2/Tf2-Main.html", note: "按时间戳查询坐标变换并处理 lookup 失败。" }, { title: "URDF tutorials", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/URDF/URDF-Main.html", note: "理解 link、joint 和机器人模型的结构。" }],
  "cpp-ros-bag": [{ title: "rosbag2", source: "ROS 2 官方文档", href: "https://github.com/ros2/rosbag2", note: "用录制和回放把设备问题变成离线输入。" }, { title: "ROS 2 testing", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Testing/Testing.html", note: "将节点行为和固定消息 fixture 接入测试。" }],
  "cpp-ros-custom": [{ title: "Creating custom ROS 2 msg and srv files", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Beginner-Client-Libraries/Custom-ROS2-Interfaces.html", note: "设计字段、版本和接口包边界。" }, rosConcepts],
  "cpp-ros-composition": [{ title: "Composing multiple nodes in a single process", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Composition.html", note: "理解组件注册、容器和进程内通信。" }, rosConcepts],
  "cpp-ros-qos": [{ title: "About Quality of Service settings", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Quality-of-Service-Settings.html", note: "查阅 reliability、durability、history 和 depth。" }, rosConcepts],
  "cpp-ros-plugins": [{ title: "pluginlib", source: "ROS 2 开源项目", href: "https://github.com/ros2/pluginlib", note: "观察机器人系统如何把实现和运行时装配解耦。" }, { title: "ROS 2 composition", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Composition.html", note: "比较插件、组件和进程边界。" }],
  "cpp-ros-simulation": [{ title: "Gazebo and ROS 2", source: "Gazebo 官方文档", href: "https://gazebosim.org/docs/latest/ros_installation/", note: "用仿真传感器和固定世界验证节点行为。" }, { title: "ROS 2 testing", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Testing/Testing.html", note: "把仿真输入和回归测试组合起来。" }],
  "cpp-tracing": [{ title: "ROS 2 tracing", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Tutorials/Advanced/ROS2-Tracing-Trace-and-Analyze.html", note: "使用事件和时间戳定位回调延迟和丢消息。" }, { title: "ros2_tracing", source: "ROS 2 开源项目", href: "https://github.com/ros2/ros2_tracing", note: "观察 tracing 工具链和可复现实验组织。" }],
  "cpp-sensor-pipeline": [{ title: "ROS 2 demos", source: "ROS 2 开源项目", href: "https://github.com/ros2/demos", note: "阅读 publisher、subscriber、参数和 executor 的完整示例。" }, { title: "ROS 2 QoS", source: "ROS 2 官方文档", href: "https://docs.ros.org/en/jazzy/Concepts/Intermediate/About-Quality-of-Service-Settings.html", note: "为传感器消息选择可靠性、深度和时间策略。" }],
};

export function getCppResources(lessonId: string): LearningResource[] {
  return cppResources[lessonId] ?? [cppReference, rosTutorials];
}
