import "@typespec/http";

using Http;
@service(#{ title: "Sample" })
namespace DemoService{
  model Additional {
      sample: Record<unknown>
  }
  
  model Unevaluated {
      sample: {}
  }
  @route("/sample")
  @tag("sample")
  interface SampleInterface {
    @get test1(): Additional;
    
    @post test2(): Unevaluated;
  
  }  
}


